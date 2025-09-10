export const Navbar = () => {
  return (
    <div className="bg-white absolute top-0 left-0 w-dvw border-b dark:border-zinc-800 py-2 px-3 justify-between flex flex-row items-center dark:bg-zinc-900 z-30">
      <div className="flex flex-row gap-3 items-center">
        <div className="text-sm dark:text-zinc-300">
          Information Resource Assistant
        </div>
      </div>

      <div className="text-sm p-1 px-2 bg-zinc-100 rounded-md text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100">
        RAG App
      </div>
    </div>
  );
};
