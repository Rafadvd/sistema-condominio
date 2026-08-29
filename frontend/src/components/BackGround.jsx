function BackGround() {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-violet-950 via-purple-800 to-fuchsia-600">
      <div className="absolute w-96 h-96 bg-fuchsia-500/40 rounded-full blur-3xl -top-20 -right-20" />
      <div className="absolute w-96 h-96 bg-violet-500/30 rounded-full blur-3xl -bottom-20 -left-20" />
      <div className="absolute w-[450px] h-[450px] rounded-full border border-purple-300/20 -right-20 top-20" />
      <div className="absolute w-[350px] h-[350px] rounded-full border border-purple-100/10 -left-20 bottom-0" />
    </div>
  );
}

export default BackGround;

