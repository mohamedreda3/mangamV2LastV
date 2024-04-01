import React, { useEffect, useState } from 'react';
import './navbar.css';
import { BiHomeAlt2 } from 'react-icons/bi';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
const Navbar = () => {
  const language = useSelector((state) => state.language.lang);
  const notifies = useSelector((state) => state?.notifies?.now);
  const [notify_now, setNotifyNow] = useState(false);
  useEffect(() => {
    setNotifyNow(notifies);
  }, [notifies]);
  return (
    <div className="navbar">
      <NavLink to={"/"}>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 18V15"
              stroke="#828282"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M10.07 2.81997L3.14002 8.36997C2.36002 8.98997 1.86002 10.3 2.03002 11.28L3.36002 19.24C3.60002 20.66 4.96002 21.81 6.40002 21.81H17.6C19.03 21.81 20.4 20.65 20.64 19.24L21.97 11.28C22.13 10.3 21.63 8.98997 20.86 8.36997L13.93 2.82997C12.86 1.96997 11.13 1.96997 10.07 2.81997Z"
              stroke="#828282"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>{" "}
        </div>
        <h6>{language == 'ar' ? "الرئيسية" : "Home"}</h6>
      </NavLink>
      <NavLink to={"/orderlogs2"}>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <g clip-path="url(#clip0_54_4608)">
              <path
                d="M22 6V8.42C22 10 21 11 19.42 11H16V4.01C16 2.9 16.91 2 18.02 2C19.11 2.01 20.11 2.45 20.83 3.17C21.55 3.9 22 4.9 22 6Z"
                stroke="#828282"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2 7V21C2 21.83 2.94 22.3 3.6 21.8L5.31 20.52C5.71 20.22 6.27 20.26 6.63 20.62L8.29 22.29C8.68 22.68 9.32 22.68 9.71 22.29L11.39 20.61C11.74 20.26 12.3 20.22 12.69 20.52L14.4 21.8C15.06 22.29 16 21.82 16 21V4C16 2.9 16.9 2 18 2H7H6C3 2 2 3.79 2 6V7Z"
                stroke="#828282"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M6.25 10H11.75"
                stroke="#828282"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </g>
            <defs>
              <clipPath id="clip0_54_4608">
                <rect width="24" height="24" fill="#828282" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <h6>{language == 'ar' ? "الطلبات" : "Orders"}</h6>
      </NavLink>

      <NavLink to={"/notification"} onClick={() => setNotifyNow(false)}>
        <div className="notification_now">
          {notify_now ? <span></span> : null}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 10.5199C11.59 10.5199 11.25 10.1799 11.25 9.76994V6.43994C11.25 6.02994 11.59 5.68994 12 5.68994C12.41 5.68994 12.75 6.02994 12.75 6.43994V9.76994C12.75 10.1899 12.41 10.5199 12 10.5199Z"
              fill="#828282"
            />
            <path
              d="M12.02 20.35C9.43999 20.35 6.86999 19.94 4.41999 19.12C3.50999 18.82 2.81999 18.17 2.51999 17.35C2.21999 16.53 2.31999 15.59 2.80999 14.77L4.07999 12.65C4.35999 12.18 4.60999 11.3 4.60999 10.75V8.64999C4.60999 4.55999 7.92999 1.23999 12.02 1.23999C16.11 1.23999 19.43 4.55999 19.43 8.64999V10.75C19.43 11.29 19.68 12.18 19.96 12.65L21.23 14.77C21.7 15.55 21.78 16.48 21.47 17.33C21.16 18.18 20.48 18.83 19.62 19.12C17.17 19.95 14.6 20.35 12.02 20.35ZM12.02 2.74999C8.75999 2.74999 6.10999 5.39999 6.10999 8.65999V10.76C6.10999 11.57 5.78999 12.74 5.36999 13.43L4.09999 15.56C3.83999 15.99 3.77999 16.45 3.92999 16.85C4.07999 17.25 4.41999 17.55 4.89999 17.71C9.49999 19.24 14.56 19.24 19.16 17.71C19.59 17.57 19.92 17.25 20.07 16.83C20.23 16.41 20.18 15.95 19.95 15.56L18.68 13.44C18.26 12.75 17.94 11.58 17.94 10.77V8.66999C17.93 5.39999 15.28 2.74999 12.02 2.74999Z"
              fill="#828282"
            />
            <path
              d="M12 22.8999C10.93 22.8999 9.88004 22.4599 9.12004 21.6999C8.36004 20.9399 7.92004 19.8899 7.92004 18.8199H9.42004C9.42004 19.4999 9.70004 20.1599 10.18 20.6399C10.66 21.1199 11.32 21.3999 12 21.3999C13.42 21.3999 14.58 20.2399 14.58 18.8199H16.08C16.08 21.0699 14.25 22.8999 12 22.8999Z"
              fill="#828282"
            />
          </svg>
        </div>
        <h6>{language == 'ar' ? "الإشعارات" : "Notifications"}</h6>
      </NavLink>
      <NavLink to={"/profile"}>
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12.1601 10.87C12.0601 10.86 11.9401 10.86 11.8301 10.87C9.45006 10.79 7.56006 8.84 7.56006 6.44C7.56006 3.99 9.54006 2 12.0001 2C14.4501 2 16.4401 3.99 16.4401 6.44C16.4301 8.84 14.5401 10.79 12.1601 10.87Z"
              stroke="#828282"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M7.15997 14.56C4.73997 16.18 4.73997 18.82 7.15997 20.43C9.90997 22.27 14.42 22.27 17.17 20.43C19.59 18.81 19.59 16.17 17.17 14.56C14.43 12.73 9.91997 12.73 7.15997 14.56Z"
              stroke="#828282"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <h6>{language == 'ar' ? "حسابي" : "Profile"}</h6>
      </NavLink>
    </div>
  );
};

export default Navbar;
