import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query'
import React from 'react'
import { acceptFriendRequest, getFriendsRequest } from './lib/api'
import { BellIcon, ClockIcon, MessageSquareIcon, UserCheckIcon } from 'lucide-react'
import NoNotificationsFound from '../components/NoNotificationsFound'

const NotificationPage = () => {

  const queryClient = useQueryClient();

  const { data: friendRequests, isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: getFriendsRequest,
  })

  const { mutate: acceptRequestMutation, isPending } = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests"] })
      queryClient.invalidateQueries({ queryKey: ["friends"] })
    }
  });

  const incomingRequests = friendRequests?.incomingReqs || []
  const acceptedRequests = friendRequests?.acceptedReqs || []

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='container mx-auto max-w-4xl space-y-8'>

        <h1 className='text-2xl sm:text-3xl font-bold tracking-tight mb-6'>
          Notification
        </h1>

        {isLoading ? (
          <div className='flex justify-center py-12'>
            <span className='loading loading-spinner loading-lg'></span>
          </div>
        ) : (
          <>
            {/* FRIEND REQUESTS */}
            {incomingRequests.length > 0 && (
              <section className='space-y-3'>
                <h2 className='text-xl font-semibold flex items-center gap-2'>
                  <UserCheckIcon className='h-5 w-5 text-primary' />
                  Friend Requests
                  <span className='badge badge-primary ml-2'>
                    {incomingRequests.length}
                  </span>
                </h2>

                <div className='space-y-3'>
                  {incomingRequests.map((request) => (
                    <div
                      key={request._id}
                      className='card bg-base-200 shadow-sm hover:shadow-md transition-shadow'
                    >
                      <div className='card-body p-4 flex flex-col gap-3'>

                        <div className='flex items-center gap-3'>

                          {/* AVATAR FIX */}
                          <div className='avatar'>
                            <div className='w-12 h-12 rounded-full overflow-hidden'>
                              <img
                                src={
                                  request.sender?.profilePic && request.sender.profilePic !== ""
                                    ? request.sender.profilePic
                                    : `https://ui-avatars.com/api/?name=${request.sender?.fullName || "User"}`
                                }
                                alt={request.sender?.fullName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = `https://ui-avatars.com/api/?name=${request.sender?.fullName || "User"}`;
                                }}
                              />
                            </div>
                          </div>

                          <div>
                            <h3 className='font-semibold text-base'>
                              {request.sender?.fullName}
                            </h3>

                            <div className='flex gap-2 mt-1 flex-wrap'>
                              <span className='badge badge-secondary badge-sm'>
                                Native: {request.sender?.nativeLanguage}
                              </span>
                              <span className='badge badge-outline badge-sm'>
                                Learning: {request.sender?.learningLanguage}
                              </span>
                            </div>
                          </div>

                        </div>

                        <button
                          className='btn btn-primary btn-xs w-fit self-end'
                          onClick={() => acceptRequestMutation(request._id)}
                          disabled={isPending}
                        >
                          Accept
                        </button>

                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ACCEPTED REQUESTS */}
            {acceptedRequests.length > 0 && (
              <section className="space-y-4 mt-8">
                <h2 className="flex items-center gap-2">
                  <BellIcon className="h-5 w-5 text-success" />
                  New Connections
                </h2>

                <div className="space-y-3">
                  {acceptedRequests.map((notification) => (
                    <div
                      key={notification._id}
                      className="card bg-base-200 shadow-sm"
                    >
                      <div className="card-body p-4">
                        <div className="flex items-start gap-3">
                          
                          {/* AVATAR FIX */}
                          <div className="avatar">
                            <div className="w-10 h-10 rounded-full overflow-hidden">
                              <img
                                src={
                                  notification.recipient?.profilePic && notification.recipient.profilePic !== ""
                                    ? notification.recipient.profilePic
                                    : `https://ui-avatars.com/api/?name=${notification.recipient?.fullName || "User"}`
                                }
                                alt={notification.recipient?.fullName}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.src = `https://ui-avatars.com/api/?name=${notification.recipient?.fullName || "User"}`;
                                }}
                              />
                            </div>
                          </div>

                          <div className="flex-1">
                            <h3 className="font-semibold">
                              {notification.recipient?.fullName}
                            </h3>

                            <p className="text-sm my-1">
                              {notification.recipient?.fullName} accepted your friend request
                            </p>

                            <p className="text-xs flex items-center opacity-70">
                              <ClockIcon className="h-3 w-3 mr-1" />
                              Recently
                            </p>
                          </div>

                          <div className="badge badge-success">
                            <MessageSquareIcon />
                            New Friend
                          </div>

                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* EMPTY */}
            {incomingRequests.length === 0 && acceptedRequests.length === 0 && (
              <NoNotificationsFound/>
            )}

          </>
        )}
      </div>
    </div>
  )
}

export default NotificationPage