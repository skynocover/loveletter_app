import { Machine, interpret, assign } from 'xstate';

const GameMachine = Machine(
  {
    id: 'game',
    initial: 'beforeStart',
    states: {
      beforeStart: {
        on: {
          Start: 'roundStart',
        },
      },
      roundStart: {
        on: {
          Ready: { actions: () => {} },
          Start: { target: 'beforeStart', actions: () => {} },
        },
        onEntry: () => {
          let popCard = this.deck.pop();
          let popPlayer = this.players.pop();
          if (popCard && popPlayer) {
            popPlayer.drawCard(popCard);
            this.players.unshift(popPlayer);
            console.log(JSON.stringify(this.players));
            io().to(popPlayer.id).emit('draw', popCard.title);
            return true;
          }
          return false;
        },
        onExit: () => {
          io().emit('Game', 'start');
        }, //退出
      },
    },
  },
  {
    actions: {
      // action implementations
      start: (context, event) => {
        console.log('context: ' + context);
        console.log('event: ' + JSON.stringify(event));
      },
    },
  },
);

const GameService = interpret(GameMachine)
  .onTransition((state, context) => {})
  .start();

export default GameService;
