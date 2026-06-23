import { useEffect, useState } from 'react';
import axios from 'axios';

export default function ReminderPanel() {
  const [reminders, setReminders] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/orders/reminders')
      .then(res => setReminders(res.data));
  }, []);

  if (!reminders.length) return null;

  return (
    <div className="reminder-panel">
      <h3>🔔 Due Date Reminders</h3>

      {reminders.map(order => (
        <div key={order._id}>
          {order.jobNo} - {order.jobName}
        </div>
      ))}
    </div>
  );
}