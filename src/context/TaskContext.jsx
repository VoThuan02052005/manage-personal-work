import React, { createContext, useState, useEffect, useContext } from 'react';

import { isBeforeToday, isSameDay, getNextOccurrenceDate } from '../utils/dateUtils';

const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  // Sử dụng thời gian thực tế của hệ thống
  const systemToday = new Date();
  const yyyy = systemToday.getFullYear();
  const mm = String(systemToday.getMonth() + 1).padStart(2, '0');
  const dd = String(systemToday.getDate()).padStart(2, '0');
  const CURRENT_DATE = `${yyyy}-${mm}-${dd}`;
  
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('task-manager-tasks-v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Lỗi parse tasks từ localStorage", e);
      }
    }
    // Trả về mảng rỗng thay vì dữ liệu mẫu
    return [];
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('task-manager-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const loginUser = (username, email) => {
    const userData = { username, email };
    setUser(userData);
    localStorage.setItem('task-manager-user', JSON.stringify(userData));
  };

  const [selectedDate, setSelectedDate] = useState(CURRENT_DATE);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState("Tất cả"); // Tất cả, Cao, Trung bình, Thấp
  const [filterStatus, setFilterStatus] = useState("Tất cả"); // Tất cả, Chờ, Đang thực hiện, Hoàn thành, Quá hạn

  // Lưu trữ các Task đã được thông báo nhắc nhở để tránh gửi lặp lại
  const [notifiedTasks, setNotifiedTasks] = useState(() => {
    const saved = localStorage.getItem('task-manager-notified-ids');
    return saved ? JSON.parse(saved) : [];
  });

  // Đồng bộ localStorage & Tự động cập nhật các task bị "Quá hạn"
  useEffect(() => {
    let changed = false;
    const updatedTasks = tasks.map(task => {
      // Nếu task chưa hoàn thành, ngày làm việc trước hôm nay, và chưa đánh dấu Quá hạn
      if (task.status !== "Hoàn thành" && isBeforeToday(task.date, CURRENT_DATE) && task.status !== "Quá hạn") {
        changed = true;
        return { ...task, status: "Quá hạn" };
      }
      // Ngược lại, nếu task từng quá hạn nhưng ngày được sửa lại thành tương lai/hôm nay
      if (task.status === "Quá hạn" && !isBeforeToday(task.date, CURRENT_DATE)) {
        changed = true;
        return { ...task, status: "Chờ" };
      }
      return task;
    });

    if (changed) {
      setTasks(updatedTasks);
      localStorage.setItem('task-manager-tasks-v2', JSON.stringify(updatedTasks));
    } else {
      localStorage.setItem('task-manager-tasks-v2', JSON.stringify(tasks));
    }
  }, [tasks]);

  // Bộ kiểm tra thông báo đẩy tự động (Browser Notifications)
  useEffect(() => {
    const checkInterval = setInterval(() => {
      const isNotificationsEnabled = localStorage.getItem('task-manager-notifications') === 'true';
      if (!isNotificationsEnabled || Notification.permission !== "granted") return;

      // Lấy giờ hiện tại (Giả lập giờ theo mốc 2026-05-18 của hệ thống để khớp dữ liệu)
      const now = new Date();
      const currentHours = String(now.getHours()).padStart(2, '0');
      const currentMinutes = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHours}:${currentMinutes}`;

      // Quét các công việc hôm nay chưa xong và chưa được thông báo
      tasks.forEach(task => {
        if (
          isSameDay(task.date, CURRENT_DATE) && 
          task.status !== "Hoàn thành" && 
          !notifiedTasks.includes(task.id)
        ) {
          // Nếu thời gian khớp chính xác hoặc trước 5 phút
          if (task.time === currentTimeStr) {
            new Notification(`🔔 Nhắc nhở công việc: ${task.title}`, {
              body: `Đã đến giờ thực hiện lúc ${task.time}! Mức độ ưu tiên: ${task.priority}`,
              icon: '/favicon.ico'
            });

            // Cập nhật mảng đã thông báo
            setNotifiedTasks(prev => {
              const updated = [...prev, task.id];
              localStorage.setItem('task-manager-notified-ids', JSON.stringify(updated));
              return updated;
            });
          }
        }
      });
    }, 15000); // Quét mỗi 15 giây

    return () => clearInterval(checkInterval);
  }, [tasks, notifiedTasks]);

  // CRUD Actions
  const addTask = (taskData) => {
    const newTask = {
      id: `task-${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: isBeforeToday(taskData.date, CURRENT_DATE) ? "Quá hạn" : "Chờ",
      repeat: "Không lặp",
      ...taskData
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const updateTask = (updatedTask) => {
    setTasks(prev => prev.map(task => {
      if (task.id === updatedTask.id) {
        let status = updatedTask.status;
        if (status !== "Hoàn thành") {
          status = isBeforeToday(updatedTask.date, CURRENT_DATE) ? "Quá hạn" : "Chờ";
        }
        return { ...task, ...updatedTask, status };
      }
      return task;
    }));
  };

  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    setNotifiedTasks(prev => prev.filter(id => id !== taskId));
  };

  const toggleTaskStatus = (taskId) => {
    let nextTaskToAdd = null;

    setTasks(prev => {
      const updatedList = prev.map(task => {
        if (task.id === taskId) {
          const wasCompleted = task.status === "Hoàn thành";
          const newStatus = wasCompleted ? 
            (isBeforeToday(task.date, CURRENT_DATE) ? "Quá hạn" : "Đang thực hiện") : 
            "Hoàn thành";

          // --- LOGIC CÔNG VIỆC LẶP LẠI (RECURRING TASK) ---
          // Nếu chuyển từ CHƯA XONG sang HOÀN THÀNH và có chế độ lặp lại
          if (!wasCompleted && task.repeat && task.repeat !== "Không lặp") {
            const nextDate = getNextOccurrenceDate(task.date, task.repeat);
            nextTaskToAdd = {
              id: `task-${Date.now() + 1}`,
              title: task.title,
              description: task.description,
              date: nextDate,
              time: task.time,
              priority: task.priority,
              status: isBeforeToday(nextDate, CURRENT_DATE) ? "Quá hạn" : "Chờ",
              repeat: task.repeat,
              createdAt: new Date().toISOString()
            };
          }

          return { ...task, status: newStatus };
        }
        return task;
      });

      if (nextTaskToAdd) {
        return [nextTaskToAdd, ...updatedList];
      }
      return updatedList;
    });
  };

  // --- KÉO THẢ SẮP XẾP LẠI CÔNG VIỆC (DRAG & DROP) ---
  const dragAndDropTasks = (draggedId, targetId) => {
    setTasks(prev => {
      const list = [...prev];
      const draggedIdx = list.findIndex(t => t.id === draggedId);
      const targetIdx = list.findIndex(t => t.id === targetId);

      if (draggedIdx !== -1 && targetIdx !== -1) {
        // Cắt phần tử kéo ra khỏi mảng
        const [draggedItem] = list.splice(draggedIdx, 1);
        // Chèn vào vị trí đích
        list.splice(targetIdx, 0, draggedItem);
      }
      return list;
    });
  };

  // --- NHẬP / XUẤT DỮ LIỆU JSON (IMPORT & EXPORT) ---
  const exportTasksData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `task_manager_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const importTasksData = (jsonData) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (Array.isArray(parsed)) {
        // Chuẩn hóa định dạng nếu thiếu
        const sanitized = parsed.map(t => ({
          id: t.id || `task-${Date.now()}-${Math.random()}`,
          title: t.title || "Không có tiêu đề",
          description: t.description || "",
          date: t.date || CURRENT_DATE,
          time: t.time || "09:00",
          priority: t.priority || "Trung bình",
          status: t.status || "Chờ",
          repeat: t.repeat || "Không lặp",
          createdAt: t.createdAt || new Date().toISOString()
        }));

        setTasks(sanitized);
        localStorage.setItem('task-manager-tasks-v2', JSON.stringify(sanitized));
        return true;
      }
      return false;
    } catch (e) {
      console.error("Lỗi parse JSON nhập vào", e);
      return false;
    }
  };

  // Thống kê toàn cục (Dashboard KPIs)
  const stats = React.useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter(t => t.status === "Hoàn thành").length;
    const active = tasks.filter(t => t.status === "Đang thực hiện" || t.status === "Chờ").length;
    const overdue = tasks.filter(t => t.status === "Quá hạn").length;
    
    // Thống kê theo mức độ ưu tiên
    const priorityCounts = {
      "Cao": tasks.filter(t => t.priority === "Cao").length,
      "Trung bình": tasks.filter(t => t.priority === "Trung bình").length,
      "Thấp": tasks.filter(t => t.priority === "Thấp").length,
    };

    // Chi tiết trạng thái
    const statusCounts = {
      "Hoàn thành": completed,
      "Đang thực hiện": tasks.filter(t => t.status === "Đang thực hiện" || t.status === "Chờ").length,
      "Quá hạn": overdue,
    };

    return { total, completed, active, overdue, priorityCounts, statusCounts };
  }, [tasks]);

  return (
    <TaskContext.Provider value={{
      tasks,
      setTasks,
      selectedDate,
      setSelectedDate,
      searchQuery,
      setSearchQuery,
      filterPriority,
      setFilterPriority,
      filterStatus,
      setFilterStatus,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskStatus,
      dragAndDropTasks,
      exportTasksData,
      importTasksData,
      stats,
      CURRENT_DATE,
      user,
      loginUser
    }}>
      {children}
    </TaskContext.Provider>
  );
};
