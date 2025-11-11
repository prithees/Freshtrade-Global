import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface ContactType {
  _id: string;
  name: string;
  company?: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: string;
}

const ContactListPage: React.FC = () => {
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch pending contacts
  const fetchContacts = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/contact");
      const data = await res.json();
      setContacts(data);
    } catch (err) {
      console.error("Error fetching contacts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // ✅ Mark contact as contacted
  const markAsContacted = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:4000/api/contact/${id}/contacted`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (data.success) {
        // Remove it from the list after marking as contacted
        setContacts((prev) => prev.filter((c) => c._id !== id));
      }
    } catch (err) {
      console.error("Error marking as contacted:", err);
    }
  };

  if (loading)
    return (
      <div className="text-center mt-20 text-gray-600">
        Loading contacts...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white text-center">
          📬 Contact Messages
        </h1>

        {contacts.length === 0 ? (
          <p className="text-center text-gray-500">No pending messages.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-green-500 text-white text-left">
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Company</th>
                  <th className="p-3">Phone</th>
                  <th className="p-3">Message</th>
                  <th className="p-3">Date</th>
                  <th className="p-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <motion.tr
                    key={c._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-b hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="p-3 font-medium">{c.name}</td>
                    <td className="p-3">{c.email}</td>
                    <td className="p-3">{c.company || "-"}</td>
                    <td className="p-3">{c.phone || "-"}</td>
                    <td className="p-3">{c.message}</td>
                    <td className="p-3 text-sm text-gray-500">
                      {new Date(c.createdAt).toLocaleString()}
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => markAsContacted(c._id)}
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition"
                      >
                        Mark Contacted
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactListPage;
