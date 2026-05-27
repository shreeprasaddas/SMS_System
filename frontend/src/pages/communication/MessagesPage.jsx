import React, { useState } from 'react';
import { Card, Button, Input } from '@/components/common/index.js';
import { useGetMessagesQuery, useSendMessageMutation } from '@/store/api/communicationApi.js';
import toast from 'react-hot-toast';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

function MessagesPage() {
  const { data: messagesData, isLoading } = useGetMessagesQuery();
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  
  const [formData, setFormData] = useState({
    recipientId: '',
    subject: '',
    content: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.recipientId || !formData.content) {
      toast.error('Recipient and message content are required');
      return;
    }
    
    try {
      await sendMessage({
        ...formData,
        // In a real app, recipientId would be selected from a dropdown of users
        // we'll pass it as is for the mock/backend to handle
      }).unwrap();
      
      toast.success('Message sent successfully!');
      setFormData({ recipientId: '', subject: '', content: '' });
    } catch (error) {
      toast.error('Failed to send message');
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        <p className="mt-2 text-gray-600">Direct communication with students, teachers, and parents.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        
        {/* Inbox / Message List */}
        <div className="lg:col-span-1 overflow-y-auto">
          <Card className="h-full flex flex-col">
            <h2 className="text-lg font-semibold border-b pb-3 mb-3">Recent Conversations</h2>
            
            <div className="flex-1 overflow-y-auto space-y-2">
              {isLoading ? (
                <div className="text-center py-4 text-gray-500">Loading messages...</div>
              ) : messagesData?.data?.length > 0 ? (
                messagesData.data.map((msg, idx) => (
                  <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-gray-100 cursor-pointer">
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-medium text-sm text-gray-900">{msg.senderName || 'System User'}</span>
                      <span className="text-xs text-gray-500">{new Date(msg.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-800 truncate">{msg.subject}</p>
                    <p className="text-xs text-gray-600 truncate mt-1">{msg.content}</p>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>No recent messages.</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Compose / View Message */}
        <div className="lg:col-span-2 overflow-y-auto">
          <Card className="h-full flex flex-col">
            <h2 className="text-lg font-semibold border-b pb-3 mb-4">Compose New Message</h2>
            
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Recipient ID / Username"
                  name="recipientId"
                  placeholder="e.g. STU-001 or TEA-005"
                  value={formData.recipientId}
                  onChange={handleChange}
                  required
                />
                <Input
                  label="Subject (Optional)"
                  name="subject"
                  placeholder="Brief topic"
                  value={formData.subject}
                  onChange={handleChange}
                />
              </div>
              
              <div className="flex-1 flex flex-col">
                <label className="block text-sm font-medium text-gray-700 mb-1">Message Content</label>
                <textarea
                  name="content"
                  required
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Type your message here..."
                  className="flex-1 min-h-[200px] w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 resize-none"
                />
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-100">
                <Button type="submit" variant="primary" loading={isSending} className="flex items-center gap-2">
                  <PaperAirplaneIcon className="w-4 h-4" />
                  Send Message
                </Button>
              </div>
            </form>
          </Card>
        </div>

      </div>
    </div>
  );
}

export default MessagesPage;
