export default function Footer() {
  return (
    <footer
      data-home-footer="true"
      className="border-border-default-dark relative border-t bg-black/60 px-6 pt-12 pb-1 text-sm sm:p-8 sm:pt-20 sm:pb-2 sm:text-base"
    >
      <div className="relative z-20 mb-8 flex flex-col gap-3 sm:mb-20 sm:gap-4">
        <figure>
          <img src="/signature.svg" alt="Signature" className="h-4 sm:h-5" />
        </figure>
        <p className="text-text-dark-muted text-xs sm:text-sm">
          © 2026 Cole Morgan. All rights reserved.
        </p>
      </div>

      <div className="relative z-20 grid grid-cols-1 gap-8 sm:grid-cols-12">
        <div className="flex flex-col gap-3 font-medium sm:col-span-3">
          <p className="text-text-dark-heading">Links</p>
          <a
            href="https://www.linkedin.com/in/cole-morgan-/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-dark-body hover:text-text-dark-heading w-fit py-0.5 transition-colors"
          >
            LinkedIn ↗
          </a>
          <a
            href="https://github.com/colemmorgan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-dark-body hover:text-text-dark-heading w-fit py-0.5 transition-colors"
          >
            GitHub ↗
          </a>
          <a
            href="mailto:colemmorgann@gmail.com"
            className="text-text-dark-body hover:text-text-dark-heading w-fit py-0.5 transition-colors"
          >
            Email ↗
          </a>
          <a
            href="https://github.com/colemmorgann/Portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-dark-body hover:text-text-dark-heading w-fit py-0.5 transition-colors"
          >
            Source Code ↗
          </a>
        </div>

        <div className="flex flex-col gap-3 font-medium sm:col-span-3">
          <p className="text-text-dark-heading">Sections</p>
          <a
            href="/#"
            className="text-text-dark-body hover:text-text-dark-heading w-fit py-0.5 transition-colors"
          >
            Home
          </a>
          <a
            href="/#work"
            className="text-text-dark-body hover:text-text-dark-heading w-fit py-0.5 transition-colors"
          >
            Work
          </a>
          <a
            href="/#experience"
            className="text-text-dark-body hover:text-text-dark-heading w-fit py-0.5 transition-colors"
          >
            Experience
          </a>
          <a
            href="/#competencies"
            className="text-text-dark-body hover:text-text-dark-heading w-fit py-0.5 transition-colors"
          >
            Competencies
          </a>
        </div>
      </div>

      <div className="text-text-dark-muted relative z-20 mt-12 mb-8 grid grid-cols-1 gap-4 sm:mt-24 sm:grid-cols-4 sm:items-end sm:gap-8">
        <p>
          Designed in Figma. <br /> Built with TanStack Start.
        </p>
        <p>
          Type set in{" "}
          <a
            href="https://pangrampangram.com/products/neue-montreal"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-text-dark-heading underline transition-colors"
          >
            PP Neue Montreal
          </a>
        </p>
      </div>
    </footer>
  );
}
