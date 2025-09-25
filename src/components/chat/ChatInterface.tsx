"use client";
import { useState, useEffect, useRef } from "react"; // 1. IMPORT useEffect and useRef
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Loader2, Bot, User, Send } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { queryGemini } from "@/lib/gemini-api.ts";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "👋 Hi! I’m the AI Ocean Assistant (Gemini-powered). Ask me about oceanographic data, fisheries insights, biodiversity, or molecular biology.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  // 2. CREATE A REF FOR THE ANCHOR ELEMENT
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // 3. CREATE THE useEffect TO SCROLL ON NEW MESSAGES
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await queryGemini(userMsg.content);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: reply };
      setMessages((prev) => [...prev, aiMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "assistant", content: "⚠️ Error calling Gemini API." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" /> AI Ocean Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 py-2">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className="flex gap-2 items-start max-w-[70%]">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback
                      className={msg.role === "assistant" ? "bg-blue-500 text-white" : "bg-gray-600 text-white"}
                    >
                      {msg.role === "assistant" ? <Bot className="h-4 w-4" /> : <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`px-3 py-2 rounded-lg text-sm ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white prose prose-sm prose-invert"
                        : "bg-muted prose prose-sm dark:prose-invert"
                    }`}
                  >
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {msg.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Loader2 className="animate-spin h-4 w-4" /> AI is thinking…
              </div>
            )}
            {/* 4. ADD THE INVISIBLE ANCHOR ELEMENT HERE */}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        <div className="p-3 border-t flex gap-2">
          <Input
            placeholder="Ask about SST, fish trends, biodiversity..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !loading && sendMessage()}
          />
          <Button onClick={sendMessage} disabled={!input.trim() || loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}