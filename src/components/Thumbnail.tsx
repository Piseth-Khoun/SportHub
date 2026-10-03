'use client'

import Thumb, { type ThumbProps } from './Thumb'

export { Thumb } from './Thumb'
export type ThumbnailProps = ThumbProps

export function Thumbnail(props: ThumbnailProps) {
  return <Thumb {...props} />
}

export default Thumbnail
