declare class CreatePostDto {
    title: string;
    content: string;
}
export declare class PostsController {
    index(): void;
    create(createPostDto: CreatePostDto): Promise<{
        success: boolean;
    }>;
    detail(id: string, body: CreatePostDto): {
        success: boolean;
    };
    remove(id: string): {
        success: boolean;
    };
}
export {};
