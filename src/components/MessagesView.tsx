
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Search } from "lucide-react";

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  isOwn: boolean;
}

interface Conversation {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: Date;
  unread: number;
}

export function MessagesView() {
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const conversations: Conversation[] = [
    {
      id: "1",
      name: "John Smith",
      lastMessage: "Thanks for the update on the project",
      timestamp: new Date(2024, 5, 25, 14, 30),
      unread: 2
    },
    {
      id: "2", 
      name: "Sarah Johnson",
      lastMessage: "Can we schedule a call for tomorrow?",
      timestamp: new Date(2024, 5, 25, 10, 15),
      unread: 0
    },
    {
      id: "3",
      name: "Team Alpha",
      lastMessage: "Meeting notes have been shared",
      timestamp: new Date(2024, 5, 24, 16, 45),
      unread: 1
    }
  ];

  const messages: Message[] = [
    {
      id: "1",
      sender: "John Smith",
      content: "Hi, I wanted to follow up on the consultant placement we discussed.",
      timestamp: new Date(2024, 5, 25, 13, 45),
      isOwn: false
    },
    {
      id: "2",
      sender: "You",
      content: "Yes, I have a few candidates that might be a good fit. Let me send over their profiles.",
      timestamp: new Date(2024, 5, 25, 14, 10),
      isOwn: true
    },
    {
      id: "3",
      sender: "John Smith", 
      content: "Thanks for the update on the project",
      timestamp: new Date(2024, 5, 25, 14, 30),
      isOwn: false
    }
  ];

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would typically send the message to your backend
      console.log("Sending message:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Conversations List */}
      <Card className="w-1/3 min-w-[320px]">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Messages</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            {filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-3 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedConversation === conversation.id ? "bg-blue-50" : ""
                }`}
                onClick={() => setSelectedConversation(conversation.id)}
              >
                <div className="flex items-start gap-3">
                  <Avatar className="flex-shrink-0">
                    <AvatarFallback className="text-xs">
                      {conversation.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-medium text-sm truncate pr-2">{conversation.name}</h4>
                      {conversation.unread > 0 && (
                        <span className="bg-blue-500 text-white text-xs rounded-full px-1.5 py-0.5 flex-shrink-0 min-w-[20px] text-center">
                          {conversation.unread}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-1">
                      {conversation.lastMessage}
                    </p>
                    <p className="text-xs text-gray-400">
                      {conversation.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Chat Area */}
      <Card className="flex-1">
        {selectedConversation ? (
          <>
            <CardHeader className="border-b">
              <CardTitle>
                {conversations.find(c => c.id === selectedConversation)?.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col h-full p-0">
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.isOwn
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-900"
                        }`}
                      >
                        <p className="break-words">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.isOwn ? "text-blue-100" : "text-gray-500"}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  />
                  <Button onClick={handleSendMessage}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </>
        ) : (
          <CardContent className="flex items-center justify-center h-full">
            <p className="text-gray-500">Select a conversation to start messaging</p>
          </CardContent>
        )}
      </Card>
    </div>
  );
}
