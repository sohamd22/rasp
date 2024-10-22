import React, { useEffect, useRef, useCallback, useState} from "react";
import useUserStore from '../../stores/userStore';
import useChatStore, { ChatMessage, Chat } from '../../stores/chatStore';
import Message from "../chat/Message";
import { formatDate, formatTime } from "../../utils/formatDateTime";
import Input from "../inputs/Input";
import SubmitButton from "../inputs/SubmitButton";
import axios from 'axios';

const ChatPage: React.FC = () => {
    const { user } = useUserStore();
    const { 
        chats, 
        messages, 
        currentChatId, 
        message,
        setMessage,
        setMessages, 
        setCurrentChatId, 
        getChats, 
        getMessages, 
        saveMessage,
        setChats
    } = useChatStore();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [isChatListOpen, setIsChatListOpen] = useState(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };


    useEffect(() => {
        setMessages([]);
        setMessage("");
        getChats(user._id);

        if (currentChatId) {
            setPage(1);
            getMessages(currentChatId, 1, 50);
        }
    }, [user, currentChatId, getChats, getMessages, setMessages, setMessage]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleChatSelect = async (chat: Chat) => {
        setCurrentChatId(chat._id);
        if (chat.unreadMessages && chat.unreadMessages[user._id]) {
            await markChatAsRead(chat._id);
        }
    };

    const handleSaveMessage = async () => {
        try {
            await saveMessage(currentChatId, user._id, message);
            setMessage("");
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 429) {
                alert(error.response.data.error);
            }
        }
    };

    const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop } = e.currentTarget;
        if (scrollTop === 0 && !isLoading) {
            setIsLoading(true);
            getMessages(currentChatId, page + 1, 50).then(() => {
                setPage(prevPage => prevPage + 1);
                setIsLoading(false);
            });
        }
    }, [currentChatId, getMessages, isLoading, page]);

    const markChatAsRead = async (chatId: string) => {
        try {
            await axios.post(`${process.env.REACT_APP_SERVER_URL}/chat/markAsRead/${chatId}`, { userId: user._id });
            const updatedChats = chats.map((chat: Chat) => 
                chat._id === chatId ? { ...chat, unreadMessages: { ...chat.unreadMessages, [user._id]: false } } : chat
            );
            setChats(updatedChats);
        } catch (error) {
            console.error('Error marking chat as read:', error);
        }
    };

    return (
        <div className="flex flex-col md:flex-row h-[75vh] md:h-[calc(100vh-200px)] rounded-2xl overflow-hidden">
            {/* Chat List */}
            <div className={`${isChatListOpen ? 'h-full' : 'h-12'} md:h-full w-full md:w-64 text-white bg-neutral-900 transition-all duration-300 ease-in-out overflow-hidden`}>
                <div className="flex justify-between items-center p-3 md:p-5 cursor-pointer md:cursor-default" onClick={() => setIsChatListOpen(!isChatListOpen)}>
                    <h2 className="text-lg font-bold">Chats</h2>
                    <span className="md:hidden">{isChatListOpen ? '▲' : '▼'}</span>
                </div>
                <ul className="overflow-y-auto max-h-[calc(100%-48px)] overflow-x-hidden">
                    {chats.map((chat: Chat, index: number) => (
                        <li
                            key={index}
                            onClick={() => {
                                handleChatSelect(chat);
                                setIsChatListOpen(false);
                            }}
                            className={`flex flex-col p-3 border-y border-neutral-700 cursor-pointer transition-all ${chat._id === currentChatId ? "bg-neutral-800" : ""}`}
                        >
                            <span className="font-medium flex justify-between items-center">
                                {chat.isGroupChat ? chat.groupName : chat.otherUserName}
                                {chat.unreadMessages && chat.unreadMessages[user._id] && (
                                    <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                                )}
                            </span>
                            <span>
                                {chat.lastMessage?.senderId === user._id ? "You" : chat.lastMessage?.senderName}: {chat.lastMessage?.content.slice(0, 10)}... - {(formatDate(chat.lastMessage?.timestamp) === formatDate(new Date()) ? formatTime(chat.lastMessage?.timestamp) : formatDate(chat.lastMessage?.timestamp))}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
            {/* Main Chat Panel */}
            <div className="flex-1 p-3 md:p-6 bg-black">
                <div className="h-full flex flex-col">
                    {currentChatId ? (
                        <div className="overflow-y-auto flex flex-col-reverse gap-4 h-full pr-2 md:pr-8" onScroll={handleScroll}>
                            <div ref={messagesEndRef} />
                            <div className='flex gap-2 md:gap-4'>
                                <Input name="message" placeholder="Hey, I think you're super cool!" maxLength={200} value={message} setValue={setMessage} />
                                <SubmitButton onClick={handleSaveMessage}>Send</SubmitButton>
                            </div>

                            <div className="mt-auto flex flex-col gap-2">
                                {messages.map((message: ChatMessage, index: number) => {
                                    const isSender = message.sender === user?._id;
                                    return (
                                        <Message 
                                            key={index} 
                                            content={message.content} 
                                            timestamp={message.timestamp} 
                                            isSender={isSender}
                                            senderName={message.senderName}
                                        />
                                    );
                                })}
                            </div>
                            {isLoading && <div>Loading more messages...</div>}
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-gray-500 text-sm md:text-base">Select a chat to start messaging!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatPage;
