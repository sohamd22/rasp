import axios from 'axios';
import useUserStore from '../../stores/userStore';
import useDevspaceStore from '../../stores/devspaceStore';
import UserCard from '../users/UserCard';
import { Confetti } from '@neoconfetti/react';
import Heading from '../text/Heading';
import Highlight from '../text/Highlight';
import { useState, useEffect } from 'react';


const Devspace = () => {
    const { user, setUser } = useUserStore();
    const { 
        pendingInvitations, 
        acceptInvitation, 
        rejectInvitation,
        sentInvitations,
        cancelInvitation,
        team,
        error,
        setError,
        idea,
        updateIdea,
        isLoading
    } = useDevspaceStore();
    
    const [ideaForm, setIdeaForm] = useState({
        title: '',
        description: ''
    });

    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        if (idea) {
            setIdeaForm({
                title: idea.title || '',
                description: idea.description || ''
            });
        }
    }, [idea]);

    const handleIdeaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await updateIdea(user._id, ideaForm.title, ideaForm.description);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 2000);
        } catch (error) {
            console.error('Error updating idea:', error);
        }
    };

    const joinDevspace = async () => {
        try {
            const response = await axios.post('/api/devspace/join', {
                userId: user._id
            });
            setUser(response.data.user);
        } catch (error) {
            console.error('Error joining Devspace:', error);
            setError('Failed to join Devspace');
        }
    }

    const handleAcceptInvitation = async (invitationId: string) => {
        await acceptInvitation(invitationId, user._id);
    }

    const handleRejectInvitation = async (invitationId: string) => {
        await rejectInvitation(invitationId, user._id);
    }

    const handleCancelInvitation = async (receiverId: string) => {
        await cancelInvitation(receiverId, user._id);
    }

    const ideaSection = (
        <div className="flex flex-col gap-2 w-full max-w-2xl relative">
            <h2 className="text-xl sm:text-2xl font-bold">Startup Idea</h2>
            <form onSubmit={handleIdeaSubmit} className="flex flex-col gap-4 w-full">
                <input
                    type="text"
                    placeholder="One line pitch"
                    value={ideaForm.title}
                    onChange={(e) => setIdeaForm(prev => ({ ...prev, title: e.target.value }))}
                    className="p-2 rounded bg-neutral-800 w-full"
                    maxLength={100}
                    disabled={isLoading}
                />
                <textarea
                    placeholder="Brief description"
                    value={ideaForm.description}
                    onChange={(e) => setIdeaForm(prev => ({ ...prev, description: e.target.value }))}
                    className="p-2 rounded bg-neutral-800 min-h-[100px] w-full resize-y"
                    maxLength={500}
                    disabled={isLoading}
                />
                <div className="flex items-center gap-4">
                    <button 
                        type="submit" 
                        className="bg-orange-500 text-white px-4 py-2 rounded w-fit disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Updating...' : 'Update Idea'}
                    </button>
                    {showSuccess && (
                        <span className="text-green-500 animate-fade-in">
                            Idea updated successfully!
                        </span>
                    )}
                </div>
            </form>
            {isLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded">
                    <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </div>
    );

    return (
        <div className="flex flex-col gap-6 p-4 max-w-full overflow-y-auto">
          
            {!user?.isInDevspace ? (
              <div className="flex flex-col gap-12">
                <Heading>join <Highlight>Devspace</Highlight></Heading>
                <p className="text-xl">Build your own startup over a span of 5 weeks, with a chance to win upto $5000.</p>
                <button onClick={joinDevspace} className="bg-orange-500 text-white px-6 py-3 rounded w-fit font-semibold text-xl">join (takes 1 click)</button>
              </div>
            ) : (
                <div className="sm:justify-normal sm:items-start sm:text-left overflow-hidden flex flex-col gap-6 justify-center items-center text-center">
                    <div className="absolute top-0 left-0 w-full h-1/2 mx-auto -z-10">
                        <Confetti />
                    </div>
                    <Heading>welcome to <Highlight>Devspace</Highlight>!</Heading>

                    <div className="flex flex-col gap-2">
                        <h2 className="text-xl sm:text-2xl font-bold">Your team</h2>
                        {team.length > 0 ? (
                            <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                                {team.map((member: any) => (
                                    <UserCard key={member._id} user={member} selectUser={() => {}} />
                                ))}
                            </div>
                        ) : (
                            <p className="text-center sm:text-left">You are not in a team, invite people through user search, or go solo.</p>
                        )}
                    </div>

                    {ideaSection}

                    <div className="flex flex-col gap-2">
                        {sentInvitations.length > 0 && (  
                            <h2 className="text-xl sm:text-2xl font-bold">Sent Invitations</h2>
                        )}
                        <div className="flex flex-col gap-2">
                            {sentInvitations.map((invitation) => (
                                <div key={invitation.to._id} className="border p-4 rounded">
                                    <p className="text-sm sm:text-base">Invitation sent to {invitation.to.name}</p>
                                    <button onClick={() => handleCancelInvitation(invitation.to._id)} className="bg-red-500 text-white px-4 py-2 rounded mt-2 w-full sm:w-auto text-sm sm:text-base">Cancel Invitation</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        {pendingInvitations.length > 0 && (
                            <h2 className="text-xl sm:text-2xl font-bold">Pending Invitations</h2>
                        )}
                        <div className="flex flex-col gap-2">
                            {pendingInvitations.map((invitation) => (
                                <div key={invitation._id} className="border p-4 rounded">
                                    <p className="text-sm sm:text-base">Invitation from {invitation.from.name}</p>
                                    <p className="text-sm sm:text-base">Team members: {invitation.teamMembers.map(member => member.name).join(', ')}</p>
                                    <div className="flex flex-col sm:flex-row gap-2 mt-2">
                                        <button onClick={() => handleAcceptInvitation(invitation._id)} className="bg-green-500 text-white px-4 py-2 rounded w-full sm:w-auto text-sm sm:text-base">Accept</button>
                                        <button onClick={() => handleRejectInvitation(invitation._id)} className="bg-red-500 text-white px-4 py-2 rounded w-full sm:w-auto text-sm sm:text-base">Reject</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {error && error.toLowerCase() !== 'failed to fetch devspace information' && <p className="text-red-500 text-center sm:text-left">{error}</p>}
                </div>
            )}
        </div>
    )
}

export default Devspace;
