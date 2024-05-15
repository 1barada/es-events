export function ErrorUI({ error }: { error: string | string[] }) {
  return (
    <div className="flex justify-center items-center text-red-400">
      {Array.isArray(error) ? (
        error.map((message) => <p>{message}</p>)
      ) : (
        <p>{error}</p>
      )}
    </div>
  );
}