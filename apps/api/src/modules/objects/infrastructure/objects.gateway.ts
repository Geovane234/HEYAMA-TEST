import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SOCKET_EVENTS } from '@repo/shared';

@WebSocketGateway({ cors: { origin: '*' } })
export class ObjectsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server!: Server;

    handleConnection(client: Socket) {
        console.log(`Client connected: ${client.id}`);
    }

    handleDisconnect(client: Socket) {
        console.log(`Client disconnected: ${client.id}`);
    }

    notifyObjectCreated(payload: any) {
        this.server.emit(SOCKET_EVENTS.OBJECT_CREATED, payload);
    }

    notifyObjectDeleted(id: string) {
        this.server.emit(SOCKET_EVENTS.OBJECT_DELETED, { id });
    }
}
