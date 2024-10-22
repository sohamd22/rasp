import { AiOutlineMessage } from "react-icons/ai";

interface SelectedUserCardProps {
  selectedUser: any;
  openChat: (receiverId: string) => void;
}

const SelectedUserCard: React.FC<SelectedUserCardProps> = ({ selectedUser, openChat }) => {
  return (
    <div className={`w-[500px] border border-gray-600 sticky top-10 right-0`}>
      <div className="bg-gradient-to-br from-orange-300/100 to-orange-400/100">
        <img
          src={selectedUser.photo}
          alt={selectedUser.name}
          className="w-full aspect-video object-cover border border-gray-600 mix-blend-multiply"
        />
      </div>

      <div className="flex flex-col">
        <div className="flex flex-col gap-1 border border-gray-600 px-3 py-4">
          <h2 className="text-lg font-semibold flex gap-2 items-center">
            {selectedUser.name}{' '}
            <span className="text-base font-normal text-neutral-400">
              {selectedUser.about.gender ? selectedUser.about.gender + ' |' : ''}{' '}
              {selectedUser.about.campus ? selectedUser.about.campus + ' campus' : ''}
            </span>
          </h2>
          <p className="text-neutral-400">
            - {selectedUser.about.major ? selectedUser.about.major + ' |' : ''}{' '}
            {selectedUser.about.standing ? selectedUser.about.standing + ' |' : ''}{' '}
            <a href={`mailto:${selectedUser.email}`} className="underline">
              {selectedUser.email}
            </a>
          </p>
        </div>

        <div className="flex flex-col gap-1 border border-gray-600 px-3 py-4">
          <h2 className="text-lg font-semibold flex gap-2 items-center">about</h2>
          <p>{selectedUser.about.bio}</p>
        </div>

        <div className="px-3 py-4 flex flex-col gap-2 border border-gray-600">
          <h2 className="text-lg font-semibold flex gap-2 items-center">skills</h2>
          <div className="text-neutral-200 flex flex-wrap gap-2">
            {selectedUser.about.skills.map((value: string, index: number) => (
              <span className="text-neutral-300 px-2 py-1 text-sm rounded-md bg-neutral-700" key={index}>
                {value}
              </span>
            ))}
          </div>
        </div>

        <div className="px-3 py-4 flex flex-col gap-2 border border-gray-600">
          <h2 className="text-lg font-semibold flex gap-2 items-center">hobbies</h2>
          <div className="text-neutral-200 flex flex-wrap gap-2">
            {selectedUser.about.hobbies.map((value: string, index: number) => (
              <span className="text-neutral-300 px-2 py-1 text-sm rounded-md bg-neutral-700" key={index}>
                {value}
              </span>
            ))}
          </div>
        </div>

        <div className="px-3 py-4 flex flex-col gap-2 border border-gray-600">
          <h2 className="text-lg font-semibold flex gap-2 items-center">socials</h2>
          <div className="text-neutral-200 flex flex-wrap gap-2">
            {selectedUser.about.socials.map((value: string, index: number) => (
              <a href={value} className="text-neutral-300 px-2 py-1 text-sm rounded-md bg-neutral-700" key={index}>
                {value.startsWith("http") ? value.split('/')[2].split('.')[0] : value.split('.')[0]}
              </a>
            ))}
          </div>
        </div>

        <button className="px-4 py-2 w-fit bg-gradient-to-br from-orange-400 to-orange-600 text-lg text-white mx-3 my-4 flex gap-2 items-center" onClick={() => openChat(selectedUser._id)}>
          Chat <AiOutlineMessage size="1rem" />
        </button>
      </div>
    </div>
  );
};

export default SelectedUserCard;