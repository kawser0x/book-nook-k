"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Theme from "./Theme";
import {
  FaBookOpen,
  FaUser,
  FaPlusCircle,
  FaBookmark,
  FaSignOutAlt,
} from "react-icons/fa";

const Navbar = () => {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/signin");
          router.refresh();
        },
      },
    });
  };

  const navLinks = (
    <>
      <li>
        <Link
          href="/"
          className="font-medium text-base-content/80 transition-colors hover:bg-base-200 hover:text-primary active:bg-primary active:text-primary-content">
          Home
        </Link>
      </li>
      <li>
        <Link
          href="/rooms"
          className="font-medium text-base-content/80 transition-colors hover:bg-base-200 hover:text-primary active:bg-primary active:text-primary-content">
          Rooms
        </Link>
      </li>
      {session && (
        <>
          <li>
            <Link
              href="/add-room"
              className="font-medium text-base-content/80 transition-colors hover:bg-base-200 hover:text-primary active:bg-primary active:text-primary-content">
              Add Room
            </Link>
          </li>
          <li>
            <Link
              href="/my-booking"
              className="font-medium text-base-content/80 transition-colors hover:bg-base-200 hover:text-primary active:bg-primary active:text-primary-content">
              My Bookings
            </Link>
          </li>
        </>
      )}
      {!session && !isPending && (
        <li className="sm:hidden">
          <Link
            href="/signin"
            className="font-medium text-base-content/80 transition-colors hover:bg-base-200 hover:text-primary">
            Sign In
          </Link>
        </li>
      )}
    </>
  );

  return (
    <div className="sticky top-0 z-50 border-b border-base-300 bg-base-100/90 backdrop-blur-md">
      <div className="navbar mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="navbar-start gap-1">
          <div className="dropdown">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle btn-sm text-base-content hover:bg-base-200 lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content z-[1] mt-3 w-52 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
              {navLinks}
            </ul>
          </div>

          <Link
            href="/"
            className="flex items-center gap-1.5 px-1 py-1 text-base font-bold tracking-tight text-primary sm:text-xl">
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary text-white">
              <FaBookOpen />
            </span>
            <span className="whitespace-nowrap">StudyNook</span>
          </Link>
        </div>

        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 px-1">{navLinks}</ul>
        </div>

        <div className="navbar-end gap-2">
          {isPending ? (
            <span className="loading loading-spinner loading-xs text-primary" />
          ) : session ? (
            <div className="flex items-center gap-2">

              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-sm flex items-center gap-2 px-2 hover:bg-base-200">
                  <div className="avatar">
                    <div className="w-7 h-7 rounded-full ring-1 ring-primary/30">
                      {session.user?.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || "User Avatar"}
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-primary text-xs font-semibold text-white">
                          {session.user?.name?.charAt(0).toUpperCase() || (
                            <FaUser className="h-3 w-3" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <span className="hidden text-xs font-semibold text-base-content md:inline-block max-w-[120px] truncate">
                    {session.user?.name || "User"}
                  </span>
                </div>

                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content z-[1] mt-3 w-56 rounded-box border border-base-300 bg-base-100 p-2 shadow-lg">
                  <li className="menu-title px-3 py-1">
                    <span className="text-xs font-semibold text-base-content">
                      {session.user?.name}
                    </span>
                    <span className="text-[10px] font-normal text-base-content/60 truncate">
                      {session.user?.email}
                    </span>
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <Link href="/add-room" className="flex items-center gap-2">
                      <FaPlusCircle className="text-primary text-xs" /> Add Room
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/my-booking"
                      className="flex items-center gap-2">
                      <FaBookmark className="text-primary text-xs" /> My
                      Bookings
                    </Link>
                  </li>
                  <div className="divider my-1"></div>
                  <li>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex items-center gap-2 text-error hover:bg-error/10 active:bg-error/20">
                      <FaSignOutAlt className="text-xs" /> Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <Link
              href="/signin"
              className="btn btn-primary btn-xs font-medium text-white sm:inline-flex sm:btn-sm">
              Sign In
            </Link>
          )}

          <Theme />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
