type UserData = {
    _id: string;
    email: string;
    name: string;
    image: string;
    password: string;
    status: string;
    messages: Message[];
    createdAt: string;
    updatedAt: string;
    socketId: string;
    __v: number;
};

type Errors = {
    location: string;
    msg: string;
    path: string;
    type: string;
    value: string;
};

type Message = {
    _id: string;
    content: string;
    from: string;
    to: string;
    replyTo?: {
        content: string;
        messageId: string;
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
};
