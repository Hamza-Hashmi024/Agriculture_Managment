export default function Unauthorized() {
  return (
    <div className="flex items-center justify-center h-full">
      <h1 className="text-2xl font-bold">403 - Access Denied</h1>
      <p className="mt-2 text-gray-600">You do not have permission to view this page.</p>
    </div>
  );
}