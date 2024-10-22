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
    <div className='w-52 border border-gray-600' onClick={() => selectUser(user)}>
      <div className="bg-gradient-to-br from-orange-300/100 to-orange-400/100">
        <img src={user.photo} alt={user.name} className='w-full h-28 object-cover border border-gray-600 mix-blend-multiply' />
      </div>
      
      <div className='flex flex-col gap-2 px-3 py-5'>
        <h2 className='text-lg font-semibold'>{user.name}</h2>
        <p>{user.relevantInfo}</p>
      </div>      
    </div>
  );
}

export default UserCard;