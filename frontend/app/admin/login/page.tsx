import LoginForm from '@/components/LoginForm/LoginForm';

export default function AdminLogin() {
  return (
    <main className="flex flex-col items-center justify-center p-10 mt-20">
      <h1 className="underline text-3xl font-medium">Admin Login</h1>
      <div className="mt-20">
        <LoginForm />
      </div>
    </main>
  );
}