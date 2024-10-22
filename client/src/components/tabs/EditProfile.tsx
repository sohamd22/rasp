import axios from "axios";
import { useState, FormEvent } from "react";
import useUserStore from "../../states/userStore";

import Input from "../inputs/Input";
import ArrayInput from "../inputs/ArrayInput";
import SelectInput from "../inputs/SelectInput";
import TextBox from "../inputs/TextBox";
import SubmitButton from "../inputs/SubmitButton";
import Heading from "../text/Heading";
import EditUserCard from "../user/EditUserCard";
import ProfilePictureInput from "../inputs/ProfilePictureInput";

import isToxic from "../../utils/isToxic";

const defaultUser: any = {
    name: "",
    email: "",
    photo: null,
    about: {
        gender: "",
        campus: "",
        standing: "",
        major: "",
        skills: [],
        projects: [],
        experience: [],
        hobbies: [],
        socials: [],
        bio: "",
        status: {
            content: "",
            duration: "",
            expirationDate: new Date()
        },
    },
}

const UserProfile = () => {
    const { user } = useUserStore();

    const [userData, setUserData] = useState<any>({
        ...defaultUser,
        ...user
    });

    const saveUser = async (e: FormEvent) => {
        e.preventDefault();

        const textToCheck = `
            ${userData.name}

            ${userData.about.bio}

            ${userData.about.skills.join(" ")}

            ${userData.about.hobbies.join(" ")}

            ${userData.about.major}

            ${userData.about.socials.join(" ")}
        `

        if (await isToxic(textToCheck)) {
            alert("Your profile contains inappropriate content. Please remove it before saving.");
            return;
        };

        const response = await axios.patch(`${process.env.REACT_APP_SERVER_URL}/user/save`, { user: { ...user, ...userData } });
        if (response.status === 201) {
            alert("User saved successfully");
        }    
    };

    return (
        <div className="grid grid-cols-2 gap-20">
            <div className="flex flex-col gap-12">
                <Heading>Enter your information</Heading>

                <form onSubmit={e => e.preventDefault()} className="flex flex-col gap-6 col-span-1">
                    <ProfilePictureInput label="Upload your profile picture" name="pfp" setPhoto={(photo: any) => {
                        setUserData((userData: any) => ({ ...userData, photo }));
                    }} />
                    
                    <Input
                        label="your name"
                        name="name"
                        placeholder="e.g. forrest gump"
                        value={userData.name}
                        setValue={(value: string) => {
                            setUserData((userData: any) => ({ ...userData, name: value }));
                        }}
                        maxLength={40}
                    />
                    <SelectInput
                        label="your gender"
                        name="gender"
                        options={["male", "female", "other"]}
                        value={userData.about.gender}
                        setValue={(value: string) => {
                            setUserData((userData: any) => ({ ...userData, about: { ...userData.about, gender: value } }));
                        }}
                    />
                    <SelectInput
                        label="your asu campus"
                        name="campus"
                        options={["tempe", "downtown phoenix", "polytechnic", "online"]}
                        value={userData.about.campus}
                        setValue={(value: string) => {
                            setUserData((userData: any) => ({ ...userData, about: { ...userData.about, campus: value } }));
                        }}
                    />
                    <SelectInput
                        label="your standing"
                        name="standing"
                        options={["freshman", "sophomore", "junior", "senior", "masters", "phd"]}
                        value={userData.about.standing}
                        setValue={(value: string) => {
                            setUserData((userData: any) => ({ ...userData, about: { ...userData.about, standing: value } }));
                        }}
                    />
                    <Input
                        label="your major"
                        name="major"
                        placeholder="e.g. economics"
                        value={userData.about.major}
                        setValue={(value: string) => {
                            setUserData((userData: any) => ({ ...userData, about: { ...userData.about, major: value } }));
                        }}
                        maxLength={50}
                    />
                    <ArrayInput
                        label="your skills"
                        name="skills"
                        placeholder="e.g. running, business, etc."
                        items={userData.about.skills}
                        setItems={(items: string[]) => setUserData((userData: any) => ({ ...userData, about: { ...userData.about, skills: items } }))}
                        maxLength={20}
                        maxItems={10}
                    />
                    <ArrayInput
                        label="your hobbies"
                        name="hobbies"
                        placeholder="e.g. ping-pong, shrimping, etc."
                        items={userData.about.hobbies}
                        setItems={(items: string[]) => setUserData((userData: any) => ({ ...userData, about: { ...userData.about, hobbies: items } }))}
                        maxLength={30}
                        maxItems={10}
                    />
                    <ArrayInput
                        label="your socials (must start with http/https)"
                        name="socials"
                        placeholder="e.g. linkedin, github, etc."
                        items={userData.about.socials}
                        setItems={(items: string[]) => setUserData((userData: any) => ({ ...userData, about: { ...userData.about, socials: items.filter(item => item.startsWith("http")) } }))}
                        maxLength={100}
                        maxItems={5}
                    />
                    <TextBox
                        label="anything else about you"
                        name="bio"
                        placeholder="i lived a simple life, experienced so much, and then..."
                        value={userData.about.bio}
                        setValue={(value: string) => setUserData({ ...userData, about: { ...userData.about, bio: value } })}
                        maxLength={500}
                    />
                    
                    <SubmitButton onClick={saveUser} />
                </form>
            </div>

            <div className="col-span-1">
                <EditUserCard user={{ ...user, ...userData }} />
            </div>
        </div>
    );
};

export default UserProfile;