import { create } from 'zustand';
import axios from 'axios';

interface Invitation {
  _id: string;
  from: {
    _id: string;
    name: string;
  };
  teamMembers: {
    _id: string;
    name: string;
  }[];
}

interface SentInvitation {
  to: {
    _id: string;
    name: string;
  };
}

interface DevspaceState {
  pendingInvitations: Invitation[];
  sentInvitations: SentInvitation[];
  team: any[];
  fetchDevspaceInfo: (userId: string) => Promise<void>;
  acceptInvitation: (invitationId: string, userId: string) => Promise<void>;
  rejectInvitation: (invitationId: string, userId: string) => Promise<void>;
  sendInvitation: (senderId: string, receiverId: string) => Promise<void>;
  cancelInvitation: (receiverId: string, userId: string) => Promise<void>;
  updateDevspaceInfo: (updatedDevspace: any) => void;
  error: string | null;
  setError: (error: string | null) => void;
  idea: {
    title: string;
    description: string;
  } | null;
  updateIdea: (userId: string, title: string, description: string) => Promise<void>;
  isLoading: boolean;
}

const useDevspaceStore = create<DevspaceState>((set) => ({
  pendingInvitations: [],
  sentInvitations: [],
  error: null,
  setError: (error) => set({ error }),
  team: [],
  fetchDevspaceInfo: async (userId: string) => {
    try {
      const response = await axios.get(`/api/devspace/info/${userId}`);
      set({ 
        team: response.data.team,
        pendingInvitations: response.data.pendingInvitations,
        sentInvitations: response.data.sentInvitations,
        idea: response.data.idea || null
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching devspace info:', error);
      set({ error: 'Failed to fetch devspace information' });
      return null;
    }
  },
  acceptInvitation: async (invitationId, userId) => {
    try {
      await axios.post('/api/devspace/accept-invitation', { invitationId, userId });
    } catch (error) {
      console.error('Error accepting invitation:', error);
      set({ error: 'Failed to accept invitation' });
    }
  },
  rejectInvitation: async (invitationId, userId) => {
    try {
      await axios.post('/api/devspace/reject-invitation', { invitationId, userId });
    } catch (error) {
      console.error('Error rejecting invitation:', error);
      set({ error: 'Failed to reject invitation' });
    }
  },
  sendInvitation: async (senderId, receiverId) => {
    try {
      await axios.post('/api/devspace/send-invitation', { senderId, receiverId });
    } catch (error) {
      console.error('Error sending invitation:', error);
      set({ error: 'Failed to send invitation' });
    }
  },
  cancelInvitation: async (receiverId, userId) => {
    try {
      await axios.post('/api/devspace/cancel-invitation', { receiverId, userId });
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      set({ error: 'Failed to cancel invitation' });
    }
  },
  updateDevspaceInfo: (updatedDevspace) => {
    set({
      team: updatedDevspace.team,
      pendingInvitations: updatedDevspace.pendingInvitations,
      sentInvitations: updatedDevspace.sentInvitations,
      idea: updatedDevspace.idea
    });
  },
  idea: null,
  updateIdea: async (userId: string, title: string, description: string) => {
    set({ isLoading: true, error: null });
    try {
      await axios.post('/api/devspace/update-idea', { userId, title, description });
      set({ isLoading: false });
    } catch (error) {
      console.error('Error updating idea:', error);
      set({ error: 'Failed to update idea', isLoading: false });
    }
  },
  isLoading: false,
}));

export default useDevspaceStore;
