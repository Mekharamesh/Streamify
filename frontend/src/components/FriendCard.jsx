import React from 'react'
import { Link } from 'react-router-dom'
import { LANGUAGE_TO_FLAG } from "../constants";

const FriendCard = ({ friend }) => {
  return (
    <div className='card bg-base-200 hover:shadow-md transition-shadow'>
      <div className='card-body p-4'>

        {/* USER */}
        <div className='flex items-center gap-3 mb-3'>
          <div className='avatar'>
            <div className='w-12 h-12 rounded-full overflow-hidden'>
              <img
                src={
                  friend?.profilePic && friend.profilePic !== ""
                    ? friend.profilePic
                    : `https://ui-avatars.com/api/?name=${friend?.fullName || "User"}`
                }
                alt={friend.fullName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = `https://ui-avatars.com/api/?name=${friend?.fullName || "User"}`;
                }}
              />
            </div>
          </div>

          <h3 className='font-semibold truncate'>
            {friend.fullName}
          </h3>
        </div>

        {/* LANGUAGES */}
        <div className='flex flex-wrap gap-1.5 mb-3'>
          <span className='badge badge-outline text-xs'>
            {getLanguageFlag(friend.nativeLanguage)}
            Native: {friend.nativeLanguage}
          </span>

          <span className='badge badge-outline text-xs'>
            {getLanguageFlag(friend.learningLanguage)}
            Learning: {friend.learningLanguage}
          </span>
        </div>

        {/* BUTTON */}
        <Link to={`/chat/${friend._id}`} className='btn btn-outline w-full'>
          Message
        </Link>

      </div>
    </div>
  )
}

export default FriendCard


// ✅ FLAG FUNCTION (SAFE)
export const getLanguageFlag = (language) => {
  if (!language) return "🌐";

  const langLower = language.toLowerCase();
  const countryCode = LANGUAGE_TO_FLAG[langLower];

  if (!countryCode) return "🌐";

  return (
    <img
      src={`https://flagcdn.com/24x18/${countryCode}.png`}
      alt={`${langLower} flag`}
      className="h-3 mr-1 inline-block"
      onError={(e) => {
        e.target.style.display = "none";
      }}
    />
  );
};