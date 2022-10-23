import { Router, Request, Response, NextFunction } from 'express';
import { existsSync, writeFileSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { createCookieAPI } from 'framework/platform/cookie/server';
import { v4 } from 'uuid';
import { useErrorsInFakeAPI, useRandomLatencyInFakeAPI } from 'application/constants/cookies';

const dataJSONPath = `./data.json`;
const isDataJSONExists = existsSync(dataJSONPath);

if (!isDataJSONExists) {
  writeFileSync(dataJSONPath, JSON.stringify({ users: [] }));
}

/**
 * This service is made to demonstrate useMutation/invalidate queries with react-query
 * You can delete it at any time
 */
export const fakeCRUDRouter = Router();

async function fakeAPIRandomLatencyAndErrorResponser(req: Request, res: Response, next: NextFunction) {
  const cookieAPI = createCookieAPI(req, res);
  const useErrorsInFakeAPIFromCookie = cookieAPI.get(useErrorsInFakeAPI.name);
  const useRandomLatencyInFakeAPIFromCookie = cookieAPI.get(useRandomLatencyInFakeAPI.name);

  if (useRandomLatencyInFakeAPIFromCookie === '1') {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, Math.round(Math.random() * 2000));
    });
  }

  if (useErrorsInFakeAPIFromCookie === '1' && Math.random() <= 0.2) {
    return res.status(500).json(renderError(500, 'Fake error'));
  }

  next();
}

fakeCRUDRouter.use(fakeAPIRandomLatencyAndErrorResponser).get('/users', async (req, res) => {
  const parsedLimit = parseInt(req.query['limit']?.toString() || '0', 10);
  const limit = Number.isNaN(parsedLimit) ? 10 : parsedLimit;
  const parsedOffset = parseInt(req.query['offset']?.toString() || '0', 10);
  const offset = Number.isNaN(parsedOffset) ? 0 : parsedOffset;
  // In case of /users?status=active&status=banned
  const statusFilter = (
    Array.isArray(req.query['status']) ? req.query['status'] : [req.query['status']]
  ).filter((s) => !!s);

  const users = await readUsers();
  const filteredUsers = statusFilter.length
    ? users.filter((u) => statusFilter.includes(u.status))
    : users;

  if (!filteredUsers.length) {
    return res.status(404).json(renderError(404, 'No users'));
  }

  return res.status(200).json({
    data: {
      users: filteredUsers.slice(offset, limit + offset),
      total: filteredUsers.length,
    },
  });
});

fakeCRUDRouter.use(fakeAPIRandomLatencyAndErrorResponser).get('/users/:id', async (req, res) => {
  const userIdToGet = req.params.id;

  const users = await readUsers();

  const neededUser = users.find((u) => u.id === userIdToGet);

  if (!neededUser) {
    return res.status(404).json(renderError(404, `No user with id: ${userIdToGet}`));
  }

  return res.status(200).json({
    data: { user: neededUser },
  });
});

fakeCRUDRouter.use(fakeAPIRandomLatencyAndErrorResponser).post('/users', async (req, res) => {
  const users = await readUsers();
  const newUserId = v4();

  const newList = []
    .concat(
      {
        ...req.body,
        id: newUserId,
      },
      ...users,
    )
    .slice(0, 40);

  await writeUsers(newList);

  return res.status(200).json({
    data: { id: newUserId },
  });
});

fakeCRUDRouter.use(fakeAPIRandomLatencyAndErrorResponser).patch('/users/:id', async (req, res) => {
  const userIdToUpdate = req.params.id;
  const paramsToUpdate = req.body;
  const users = await readUsers();
  const userToUpdateIndex = users.findIndex((u) => u.id === userIdToUpdate);
  const mutableUserToUpdate = users[userToUpdateIndex];

  if (!mutableUserToUpdate) {
    return res.status(400).json(renderError(400, `No user with id: ${userIdToUpdate}`));
  }

  if (paramsToUpdate.name) {
    mutableUserToUpdate.name = paramsToUpdate.name;
  }

  if (paramsToUpdate.status) {
    mutableUserToUpdate.status = paramsToUpdate.status;
  }

  await writeUsers(users);

  return res.status(200).json({
    data: { user: mutableUserToUpdate },
  });
});

fakeCRUDRouter.use(fakeAPIRandomLatencyAndErrorResponser).delete('/users/:id', async (req, res) => {
  const userIdToDelete = req.params.id;
  const users = await readUsers();

  if (!users.length || !users.find((u) => u.id === userIdToDelete)) {
    return res.status(400).json(renderError(400, `No user with id: ${userIdToDelete}`));
  }

  const filteredUsers = users.filter((u) => u.id !== userIdToDelete);

  await writeUsers(filteredUsers);

  return res.status(200).json({
    data: { id: userIdToDelete },
  });
});

function writeUsers(users: any[]) {
  return writeFile(
    dataJSONPath,
    JSON.stringify({
      users,
    }),
  );
}

function readUsers(): Promise<any[]> {
  return readFile(dataJSONPath).then((data) => {
    return JSON.parse(data.toString()).users;
  });
}

function renderError(code: number, message?: string) {
  return {
    error: {
      code,
      message,
    },
  };
}
