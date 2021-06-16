import asyncio
import websockets
import subprocess

IP = 'localhost'
PORT = 40022

def run_command(cmd):
  completedProcess = subprocess.run(cmd, shell=True)

  if completedProcess.stdout:
    print('Output:')
    print(completedProcess.stdout)

  if completedProcess.stderr:
    print('Error:')
    print(completedProcess.stderr)

async def ws_server(websocket, path):
  while True:
    cmd = await websocket.recv()
    print(cmd)
    run_command(f'notify-send -t 3000 "Command recieved:\n{cmd}"')
    run_command(cmd)

if __name__ == '__main__':
  start_server = websockets.serve(ws_server, IP, PORT)

  asyncio.get_event_loop().run_until_complete(start_server)
  asyncio.get_event_loop().run_forever()