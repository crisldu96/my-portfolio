import HomeClient from '@/components/landing/HomeClient';
import { getRecentPosts } from '@/lib/blog';

export default function Home() {
  const recentPosts = getRecentPosts(3);
  return <HomeClient recentPosts={recentPosts} />;
}
