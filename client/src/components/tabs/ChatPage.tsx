import React, { useEffect, useRef, useCallback, useState} from "react";
import useSocketStore from '../../states/socketStore';
import useUserStore from '../../states/userStore';
import useChatStore, { ChatMessage, Chat } from '../../states/chatStore';
import Message from "../chat/Message";
import { formatDate } from "../../utils/formatDateTime";
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
        updateChat,
        addMessageToCache,
        setChats
    } = useChatStore();

    const { socket } = useSocketStore();

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

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

    useEffect(() => {
        socket?.on('message', (newMessage: ChatMessage) => {
            addMessageToCache(newMessage.chat, newMessage);
            
            if(newMessage.chat === currentChatId) {
                setMessages([...messages, newMessage]);
            }        
            
            const updatedChat = chats.find(chat => chat._id === newMessage.chat);
            if (updatedChat) {
                updatedChat.lastMessage = {
                    messageId: newMessage._id,
                    content: newMessage.content,
                    timestamp: newMessage.timestamp,
                    senderName: newMessage.sender === user._id ? user.name : updatedChat.otherUserName,
                    senderId: newMessage.sender
                };
                if (newMessage.sender !== user._id && newMessage.chat !== currentChatId) {
                    updatedChat.unreadMessages = { ...updatedChat.unreadMessages, [user._id]: true };
                }
                updateChat(updatedChat);
            }
        });

        return () => {
            socket?.off('message');
        };
    }, [socket, messages, setMessages, currentChatId, chats, updateChat, user._id, user.name, addMessageToCache]);

    useEffect(() => {
        socket?.on('chat', (updatedChat: Chat) => {
            updateChat(updatedChat);
        });
    }, [socket, updateChat]);

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
            const updatedChats = chats.map(chat => 
                chat._id === chatId ? { ...chat, unreadMessages: { ...chat.unreadMessages, [user._id]: false } } : chat
            );
            setChats(updatedChats);
        } catch (error) {
            console.error('Error marking chat as read:', error);
        }
    };

    return (
        <div className="flex h-full">
            <div className="h-full w-64 text-white p-4" style={{ backgroundColor: '#262626' }}>
                <h2 className="text-lg font-bold mb-4">chats</h2>
                <ul className="space-y-2">
                    {chats.map((chat, index) => (
                        <li
                            key={index}
                            onClick={() => handleChatSelect(chat)}
                            className={`flex flex-col p-2 rounded-md cursor-pointer transition-all ${chat._id === currentChatId ? "bg-gray-600" : "bg-neutral-900"}`}
                        >
                            <span className="font-medium flex justify-between items-center">
                                {chat.isGroupChat ? chat.groupName : chat.otherUserName}
                                {chat.unreadMessages && chat.unreadMessages[user._id] && (
                                    <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
                                )}
                            </span>
                            <span>
                                {chat.lastMessage?.senderId === user._id ? "You" : chat.lastMessage?.senderName}: {chat.lastMessage?.content} - {formatDate(chat.lastMessage?.timestamp)}
                            </span>
                            </li>
                    ))}
                </ul>
            </div>
            {/* Main Chat Panel */}
            <div className="flex-1 p-6 bg-black">
                <div className="h-full flex flex-col">
                    {currentChatId ? (
                        <div className="overflow-y-scroll flex flex-col-reverse gap-4 h-full" onScroll={handleScroll}>
                            <div ref={messagesEndRef} />
                            <div className='flex gap-4'>
                                <Input name="message" placeholder="Hey, I think you're super cool!" value={message} setValue={setMessage} />
                                <SubmitButton onClick={handleSaveMessage} />
                            </div>

                            <div className="mt-auto flex flex-col gap-2">
                                {messages.map((message, index) => {
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
                            <p className="text-gray-500">Select a chat to start messaging!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default ChatPage;