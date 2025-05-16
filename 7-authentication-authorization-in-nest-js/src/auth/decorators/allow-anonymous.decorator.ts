import { SetMetadata } from "@nestjs/common"

export const AllowAnonymous = () => {
    return SetMetadata('isPublic', true);
}