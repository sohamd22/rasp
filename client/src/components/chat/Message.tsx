import React from 'react'
import { formatDate, formatTime } from '../../utils/formatDateTime';

interface MessageProps {
    content: string;
    timestamp: Date;
    isSender: boolean;
    senderName: string;
}

const Message: React.FC<MessageProps> = ({ content, timestamp, isSender, senderName }) => {
    return (
        <div className={`flex flex-col ${isSender ? 'items-end' : 'items-start'}`}>
            <div className={`max-w-[60%] h-fit rounded-lg p-3 ${isSender ? 'bg-orange-500 text-white' : 'bg-gray-200 text-black'}`}>
                <p className="text-sm font-semibold mb-1">{senderName}</p>
                <p className="break-words">{content}</p>
                <p className="text-xs mt-1 opacity-70">{(formatDate(timestamp) === formatDate(new Date()) ? formatTime(timestamp) : formatDate(timestamp) + " " + formatTime(timestamp))}</p>
            </div>
        </div>
    );
};

export default Message