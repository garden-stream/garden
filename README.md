# garden

[![Join the chat at https://gitter.im/whiteboards/garden-common](https://badges.gitter.im/whiteboards/garden-common.svg)](https://gitter.im/whiteboards/garden-common?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

## What is it?

Garden is a *stream* of data that you choose. That can be a `link`, `image`, `video`, or just some `text`. 
This data stream is shared with your friends. You can follow, and be followed by others. 
At inception there are not any privacy controls for sharing data only with certain people. Nor can you reject a follower.

Think of a it as a baby between google keep (notes) and twitter (shared small content). A user is given the ability to share small bits
of `content` with the friends as they wish.

A person using `garden` should be able to share content with their followers as they see fit (much like twitter) 
but their own content should also behave like notes. Meaning that they are easy to browse, and search. All posts are 
directly owned by their creators. Meaning there is no option/api to fetch a list of posts by themselves. 
It must be done through users. Each user a person is following, should act like a notepad that can be explored, 
with the most recently updated appearing at the top. 

*some of these privacy controls may be added later, especially the ability to block followers*

Here is a short run down of features we are hoping to have.

- Native apps. (android, iOS, desktop, web, electron, etc.)
- "share via" functionality for android
- Data stream (should refresh on it's own)
- Followers/follwing (this builds the data stream)
- Paging API (we don't always want every bit ever shared)
- Content Parsing (if a link is a youtube video, give me a video, not a link)
- Content type (at inception, a person has to pick the kind of content something is, until we get better at doing so)
- Authentication

More to come.

## Installation

*Note: Garden requires a MongoDB instance.*

To quickly get a dev environment going follow these steps.

1. Run `npm install`.
2. Run `npm run db`.
3. In a separate terminal, run `npm start`.

## Api Spec

Resource List:
- user
- post
- special

### User

A user should have the following routes
- GET
  - `/user` expects `/user/username`
  - `/user/followers` expects `/user/_id/followers`
  - `/user/following` expects `/user/_id/following`
  - `/user/posts` expects `/user/_id/posts`

- POST
  - `/user/follow` expects `token` header, and `/user/_id/follow` 
  

### post
- POST
  - `/post` expects `token` header 
    - body should contain `contentType`, and `content`
  - Default types of `content` should be one of the following 4
    - `video`
    - `image`
    - `text`
    - `link`
  - It is up to the client in terms of how they display each type of content, but they should support at least these 4.
  - Optionally, if they don't understand a content type, they should not display it.
  
### Special
- POST expects `username` and `password` on POST
  - `/auth/signup`
  - `/auth/login`
  
- GET 
  - `/auth/logout` expects `token` header