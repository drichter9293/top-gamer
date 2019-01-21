import express from 'express';

const router = express.Router();

/* GET users listing. */
router.get('/', function(req: express.Request, res: express.Response, next) {
  res.json([
    {
      id: 1,
      username: "drichter"
    },
    {
      id: 2,
      username: "rmariano"
    }
  ]);
});

export default router;
