export default function Nav() {
  return (
    <nav className="border-border-default bg-surface-page fixed top-0 right-0 left-0 z-50 border-b">
      <div className="mx-auto flex items-center justify-between px-8 py-2.5 font-medium">
        <p className="">Cole Morgan</p>

        <ul className="flex items-center gap-3 leading-5">
          <li className="cursor-pointer px-2 py-2">Home</li>
          <li className="text-text-muted cursor-pointer px-2 py-2">Work</li>
          <li className="text-text-muted cursor-pointer px-2 py-2">About</li>
          <li>
            <a className="cta bg-surface-action group relative block cursor-pointer overflow-hidden rounded-full px-4 py-2">
              <p className="relative z-10"> Contact Me &nbsp; →</p>
              <div className="bg-surface-action-hover absolute top-1/2 left-1/2 z-0 size-1 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 transition-all duration-200 group-hover:size-36 group-hover:opacity-100"></div>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}
