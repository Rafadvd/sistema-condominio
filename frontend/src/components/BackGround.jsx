function BackGround({ variant = "purple" }) {
  if (variant === "blue") {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-800 to-cyan-600">
        <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-cyan-400/35 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-blue-500/30 blur-3xl" />
        <div className="absolute -right-20 top-20 h-[450px] w-[450px] rounded-full border border-blue-300/20" />
        <div className="absolute -left-20 bottom-0 h-[350px] w-[350px] rounded-full border border-blue-100/10" />
      </div>
    );
  }

  return (
    <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-purple-800 to-fuchsia-600">
      <div className="absolute -top-20 -right-20 h-96 w-96 rounded-full bg-fuchsia-500/40 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-violet-500/30 blur-3xl" />
      <div className="absolute -right-20 top-20 h-[450px] w-[450px] rounded-full border border-purple-300/20" />
      <div className="absolute -left-20 bottom-0 h-[350px] w-[350px] rounded-full border border-purple-100/10" />
    </div>
  );
}

export default BackGround;
