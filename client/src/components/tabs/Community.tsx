// src/components/tabs/Community.tsx

import axios from "axios";
import { useState, useEffect, FormEvent } from "react";
import Heading from "../text/Heading";
import Input from "../inputs/Input";
import SelectInput from "../inputs/SelectInput";
import SubmitButton from "../inputs/SubmitButton";
import useUserStore from "../../states/userStore";
interface Status {
  content: string;
  duration: string;
}

interface UserStatus {
  user: {
    name: string;
    email: string;
    photo: string;
    about: {
      status: {
        content: string;
        expirationDate: string;
      };
    };
  };
}

const Community: React.FC = () => {
  const { user } = useUserStore();
  const [status, setStatus] = useState<Status>({
    content: user?.about?.status?.content || "",
    duration: "",
  });
  const [statuses, setStatuses] = useState<UserStatus[]>([]);

  // Fetch all user statuses
  const fetchStatuses = async () => {
    try {
      // Assuming the API endpoint to fetch all statuses is "/user/statuses"
      const response = await axios.get("http://localhost:5000/user/statuses");
      setStatuses(response.data);
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  };

  useEffect(() => {
    fetchStatuses();
  }, []);

  const setUserStatus = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.patch("http://localhost:5000/user/status", {
        status: status.content,
        duration: status.duration,
        userId: user?._id,
      });
      fetchStatuses(); // Refresh statuses after setting a new status
    } catch (error) {
      console.error("Error setting status:", error);
    }
  };

  // Function to calculate the remaining time until the status expires
  const calculateRemainingTime = (expirationDate: string) => {
    const now = new Date();
    const expiration = new Date(expirationDate);
    const timeDiff = expiration.getTime() - now.getTime();

    if (timeDiff <= 0) {
      return "Expired";
    }

    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );

    if (days > 0) {
      return `${days} day(s)`;
    } else if (hours > 0) {
      return `${hours} hour(s)`;
    } else {
      return "Less than an hour";
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <Heading>Community</Heading>

      {/* Form to set user status */}
      <form onSubmit={setUserStatus} className="flex gap-4 items-center">
        <div className="flex items-center gap-2">
          <div className="w-72">
            <Input
              label="Status"
              name="content"
              placeholder="What's on your mind?"
              value={status.content}
              setValue={(value) => {
                setStatus((prevStatus) => ({ ...prevStatus, content: value }));
              }}
            />
          </div>
          <div className="w-30">
            <SelectInput
              label="Duration"
              name="duration"
              options={["24h", "48h", "1w"]}
              value={status.duration}
              setValue={(value) => {
                setStatus((prevStatus) => ({
                  ...prevStatus,
                  duration: value,
                }));
              }}
            />
          </div>
        </div>
        <div className="mt-4">
          <SubmitButton onClick={setUserStatus} />
        </div>
      </form>

      {/* Display user's own status */}
      {user?.about?.status?.content && user?.about?.status?.expirationDate ? (
        <div className="text-neutral-200">
          <p>
            Your status: "{user.about.status.content}" expires in{" "}
            {calculateRemainingTime(user.about.status.expirationDate)}
          </p>
        </div>
      ) : null}

      {/* Display all user statuses */}
      <div className="flex flex-wrap gap-6 mt-8">
        {statuses.map((statusItem, index) => (
          <div key={index} className="relative">
            {/* Profile picture with status bubble */}
            <div className="relative">
              <img
                src={statusItem.user.photo}
                alt={`${statusItem.user.name}'s profile`}
                className="w-24 h-24 rounded-full"
              />
              {/* Status bubble */}
              {statusItem.user.about.status && (
                <div className="absolute -top-2 -right-2 bg-purple-600 text-white text-xs rounded-full px-2 py-1">
                  {statusItem.user.about.status.content}
                </div>
              )}
            </div>
            {/* User name */}
            <p className="text-center text-neutral-200 mt-2">
              {statusItem.user.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Community;
