import axios from 'axios';
import useUserStore from '../../stores/userStore';
import useDevspaceStore from '../../stores/devspaceStore';
import UserCard from '../users/UserCard';

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
    } = useDevspaceStore();

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

    return (
        <div className="flex flex-col gap-6">
            {!user?.isInDevspace ? (
                <button onClick={joinDevspace} className="bg-blue-500 text-white px-4 py-2 rounded">Join Devspace</button>
            ) : (
                <>
                    <h1 className="text-4xl font-bold">Welcome to Devspace!</h1>

                    <div className="flex flex-col gap-2">
                        <h2 className="text-2xl font-bold">Your team</h2>
                        {team.length > 0 ? (
                            <div className="flex flex-wrap gap-4">
                                {team.map((member: any) => (
                                    <UserCard key={member._id} user={member} selectUser={() => {}} />
                                ))}
                            </div>
                        ) : (
                            <p>You are not in a team, invite people through user search, or go solo.</p>
                        )}
                    </div>

                    <div>
                      {sentInvitations.length > 0 && (  
                        <h2 className="text-2xl font-bold">Sent Invitations</h2>
                      )}
                        {sentInvitations.map((invitation) => (
                            <div key={invitation.to._id} className="border p-4 rounded mb-2">
                                <p>Invitation sent to {invitation.to.name}</p>
                                <button onClick={() => handleCancelInvitation(invitation.to._id)} className="bg-red-500 text-white px-4 py-2 rounded mt-2">Cancel Invitation</button>
                            </div>
                        ))}
                    </div>

                    <div>
                      {pendingInvitations.length > 0 && (
                        <h2 className="text-2xl font-bold">Pending Invitations</h2>
                      )}
                        {pendingInvitations.map((invitation) => (
                            <div key={invitation._id} className="border p-4 rounded mb-2">
                                <p>Invitation from {invitation.from.name}</p>
                                <p>Team members: {invitation.teamMembers.map(member => member.name).join(', ')}</p>
                                <div className="flex gap-2 mt-2">
                                    <button onClick={() => handleAcceptInvitation(invitation._id)} className="bg-green-500 text-white px-4 py-2 rounded">Accept</button>
                                    <button onClick={() => handleRejectInvitation(invitation._id)} className="bg-red-500 text-white px-4 py-2 rounded">Reject</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {error && <p className="text-red-500">{error}</p>}
                </>
            )}
        </div>
    )
}

export default Devspace;
