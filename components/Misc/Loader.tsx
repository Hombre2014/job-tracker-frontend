const Loader = (title: any) => {
  return (
    <div className="flex justify-center items-center gap-4">
      <p className="text-center">{title}...</p>
      <span className="loading loading-ring loading-lg"></span>
    </div>
  );
};

export default Loader;
