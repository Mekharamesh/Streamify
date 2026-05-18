import React, { useState } from 'react'
import useAuthUser from "../hooks/useAuthUser.js"; 
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CameraIcon, LoaderIcon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from 'lucide-react';
import { completeOnboarding } from './lib/api.js'; 
import toast from "react-hot-toast"; 
import { LANGUAGES } from '../constants/index.js';

const OnboardingPage = () => {
  const { authUser } = useAuthUser();
  const queryClient = useQueryClient();

  const [formState, setFormState] = useState({
    fullName: authUser?.fullName || "",
    bio: authUser?.bio || "",
    nativeLanguage: authUser?.nativeLanguage || "", 
    learningLanguage: authUser?.learningLanguage || "", 
    location: authUser?.location || "",
    profilePic: authUser?.profilePic || "",
  });

  const { mutate: onboardingMutation, isPending } = useMutation({
    mutationFn: completeOnboarding,
    onSuccess: () => {
      toast.success("Profile onboarded successfully");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError:(error)=>{
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  });

  const handleSubmit = (e) => { 
    e.preventDefault();
    onboardingMutation(formState);
  };

 const handleRandomAvatar = () => {
  const randomAvatar = `https://ui-avatars.com/api/?name=${formState.fullName || "User"}&background=random`;

  setFormState((prev) => ({
    ...prev,
    profilePic: randomAvatar
  }));

  toast.success("Avatar changed successfully");
};

  return (
    <div className='min-h-screen bg-base-100 flex items-center justify-center p-4'>
      <div className='card bg-base-200 w-full max-w-3xl shadow-xl'>
        <div className='card-body p-6 sm:p-8'>
          <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6'>
            Complete Your Profile
          </h1>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='flex flex-col items-center justify-center space-y-4'>
              
              <div className='size-32 rounded-full bg-base-300 overflow-hidden'>
                {formState.profilePic ? (
                  <img 
                    src={formState.profilePic || `https://ui-avatars.com/api/?name=${formState.fullName || "User"}`} 
                    alt="Profile"
                    className='object-cover w-full h-full'
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=User`;
                    }}
                  />
                ) : (
                  <div className='h-full flex items-center justify-center'>
                    <CameraIcon className='size-12 text-base-content opacity-40'/>
                  </div>
                )}
              </div>
              <button 
                type='button' 
                onClick={handleRandomAvatar} 
                className='btn btn-accent'
              >
                <ShuffleIcon className='size-4 mr-2'/>
                Generate Random Avatar
              </button>
            </div>
            
            {/* FULL NAME */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Full Name</span>
              </label>
              <input
                type='text'
                value={formState.fullName}
                onChange={(e) => setFormState({...formState, fullName: e.target.value })}
                placeholder='Your full name'
                className='input input-bordered w-full'
                required
              />
            </div>

            {/* BIO */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Bio</span>
              </label>
              <textarea
                value={formState.bio}
                name="bio"
                onChange={(e) => setFormState({...formState, bio: e.target.value })}
                placeholder='Tell others about yourself and your language learning goals'
                className='textarea textarea-bordered w-full'
              />
            </div>

            {/* NATIVE LANGUAGE */}
            <div className='form-control'>
              <label className='label'>
                <span className='label-text'>Native Language</span>
              </label>
              <input
                type='text'
                value={formState.nativeLanguage}
                onChange={(e) => setFormState({...formState, nativeLanguage: e.target.value })}
                placeholder='Your native language'
                className='input input-bordered w-full'
                required
              />
            </div>

            {/*native LANGUAGE */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Native language</span>
                </label>
                    <select
                    name='nativeLanguage'
                    value={formState.nativeLanguage}
                    onChange={(e)=> setFormState({...formState,nativeLanguage:e.target.value})}
                    className='select select-bordered w-full'
                  >
                    <option value="">Select your native language</option>

                    {LANGUAGES.map((lang) => (
                      <option key={`native-${lang}`} value={lang.toLowerCase()}>
                        {lang}
                      </option>
                    ))}

                  </select>
                </div>

                {/* learning language */}
                <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Learning language</span>
                </label>
                   <select
                  name='learningLanguage'
                  value={formState.learningLanguage}
                  onChange={(e)=> setFormState({
                    ...formState,
                    learningLanguage: e.target.value
                  })}
                  className='select select-bordered w-full'
                >
                  <option value="">Select your language</option>

                  {LANGUAGES.map((lang) => (
                    <option key={`learning-${lang}`} value={lang.toLowerCase()}>
                      {lang}
                    </option>
                  ))}
                </select>
                </div>
            </div>
            {/* Location */}
                <div className='form-control'>
                <label className='label'>
                  <span className='label-text'>Location</span>
                </label>
                <div className='relative'>
                  <MapPinIcon className='absolute top-1/2 transform -translate-y-1/2 left-5 text-base-content opacity-70'/>
                  <input
                    type='text'
                    name='location'
                    value={formState.location}
                    onChange={(e)=> setFormState({...formState, location: e.target.value})}
                    className='input input-bordered w-full pl-10'
                    placeholder=' City, Country'
                  />
                </div>
                </div>

                <button className='btn btn-primary w-full' disabled={isPending} type="submit">
                  {!isPending ? (
                    <>
                     <ShipWheelIcon className='size-5 mr-2'/>
                     Complete Onboarding
                    </>
                  ):(
                    <>
                    <LoaderIcon className='animate-spin size-5 mr-2'/>
                    Onboarding...
                    </>
                  )}
                </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default OnboardingPage;