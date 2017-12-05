const express = require('express');
const menusRouter = express.Router();

//sqlite
const sqlite3 = require('sqlite3');
const db = new sqlite3.Database(process.env.TEST_DATABASE || './database.sqlite');

// export module
module.exports = menusRouter;

//import menu items
const menuItemsRouter = require('./menu-items.js');
menusRouter.use('/:menuId/menu-items', menuItemsRouter);

// menu id params
menusRouter.param('menuId', (req, res, next, menuId) => {
  const sql = "SELECT * FROM Menu WHERE Menu.id = $menuId";
  const values = {$menuId : menuId};
  db.get(sql, values, (error, menu) => {
    if (error) {
      next(error);
    } else if (menu) {
      req.menu = menu;
      next();
    } else {
      res.status(404).send();
    }
  });
});

//get all menus
menusRouter.get('/', (req, res, next) => {
  db.all('SELECT * FROM Menu', (error, menus) => {
    if (error) {
      next(error);
    } else {
      res.status(200).json({menus : menus});
    }
  });
});

//get a menu by id
menusRouter.get('/:menuId', (req, res, next) => {
  res.status(200).json({menu: req.menu});
});

// post a new menu
menusRouter.post('/', (req, res, next) =>{
  const title = req.body.menu.title;
  if (!title) {
    return res.sendStatus(400);
  }

  const sql = "INSERT INTO Menu (title) VALUES ($title)";
  const values = {$title : title};
  db.run(sql, values, function(error) {
    if (error) {
      next(error);
    } else {
      db.get(`SELECT * FROM Menu WHERE Menu.id = ${this.lastID}`, (error, menu) => {
        res.status(201).json({menu: menu});
      });
    }
  });
});

// update an menu
menusRouter.put('/:menuId', (req, res, next) =>{
  const title = req.body.menu.title;
  if (!title) {
    return res.sendStatus(400);
  }

  const sql = "UPDATE Menu SET title = $title WHERE Menu.id = $menuId";
  const values = {$title : title, $menuId : req.params.menuId};
  db.run(sql, values, function (error) {
    if (error) {
      next(error);
    } else {
      db.get(`SELECT * FROM Menu WHERE Menu.id = ${req.params.menuId}`, (error, menu) => {
        res.status(200).json({menu: menu});
      });
    }
  });
});

//delete an employee
menusRouter.delete('/:menuId', (req, res, next) => {
  const itemSql = 'SELECT * FROM MenuItem WHERE MenuItem.menu_id = $menuId';
  const itemValues = {$menuId: req.params.menuId};
  db.get(itemSql, itemValues, (error, item) => {
    if (error) {
      next(error);
    } else if (item) {
      res.sendStatus(400);
    } else {
      const deleteSql = 'DELETE FROM Menu WHERE Menu.id = $menuId';
      const deleteValues = {$menuId: req.params.menuId};

      db.run(deleteSql, deleteValues, (error) => {
        if (error) {
          next(error);
        } else {
          res.sendStatus(204);
        }
      });
    }
  });
});
