import React from 'react';

export interface UserCardInfo {
  email: string;
  name: string;
  photo: any;
  relevantInfo: string;
}

interface UserCardProps {
  user: UserCardInfo;
  selectUser: (user: UserCardInfo) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, selectUser }) => {
  return (
    <div 
      className='w-full sm:w-52 border border-gray-600 cursor-pointer hover:shadow-lg transition-shadow duration-300'
      onClick={() => selectUser(user)}
    >
      <div className="bg-gradient-to-br from-orange-300 to-orange-400">
        <img 
          src={user.photo} 
          alt={user.name} 
          className='w-full h-40 sm:h-32 object-cover border border-gray-600 mix-blend-multiply' 
        />
      </div>
      
      <div className='flex flex-col gap-2 px-4 sm:px-3 py-6 sm:py-5'>
        <h2 className='text-xl sm:text-lg font-semibold'>{user.name}</h2>
        <p className='text-sm whitespace-pre-line'>{user.relevantInfo}</p>
      </div>      
    </div>
  );
}

export default UserCard;
