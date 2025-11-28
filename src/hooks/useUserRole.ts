import { useEffect, useState } from "react";
import { authService, User } from "@/services/auth";

export interface UserRoleData {
  role: User['role'];
  userId: string;
  userName: string;
  organizationId?: string;
  sponsorId?: string;
  siteId?: string;
  providerId?: string;
}

export function useUserRole() {
  const [userData, setUserData] = useState<UserRoleData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await authService.getUser();
        
        if (!user) {
          setLoading(false);
          return;
        }

        const result: UserRoleData = {
          role: user.role,
          userId: user.id,
          userName: user.email,
        };

        setUserData(result);
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return { userData, loading };
}
