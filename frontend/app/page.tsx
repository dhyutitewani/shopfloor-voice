'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for Client Components
import { useSession } from 'next-auth/react';

const HomePage: React.FC = () => {
    const { status } = useSession(); // Destructure status from useSession
    const router = useRouter();

    useEffect(() => {
      if (status === 'unauthenticated') {
          router.replace('/users'); 
      }
    }, [router, status]); // Ensure status is included in the dependency array

    return null; 
};

export default HomePage;