const express = require('express');
const models = require('../../../models/index');
const router = express.Router();
const validate = require('./validation');

router.post('/', validate, (req, res) => {
	let values = Object.assign({}, req.body, {
		UserId: req.token.id
	});
	/*****
	 * Checking if TaskTypeId is present. If present,
	 * it means the user selected an already existing
	 * category.
	 */
	if (values.TaskCategoryId) {
		models.Task.create(values)
			.then(task => res.status(201).json({
				message: 'Task created successfully.',
				data: task
			}))
			.catch(err => res.status(500).json({
				error: err.message
			}));
	}
	else{
		values.TaskCategory = {
			name: values.TaskCategoryName,
			TaskTypeId: values.TaskTypeId,
			UserId: values.UserId
		};

		models.Task.create(values, {
			include: [models.TaskCategory]
		})
			.then(task => res.status(201).json({
				message: 'Task created successfully.',
				data: task
			}))
			.catch(err => res.status(500).json({
				error: err.message
			}));
	}
});

router.get('/:id?', (req, res) => {
	let userId = req.token.id;
	let taskId = req.params.id;
	if (taskId) {
		models.Task.findById(taskId, {
			attributes: {
				exclude: ['UserId']
			}
		})
			.then(task => {
				if (task) {
					res.status(200).json({
						data: task
					});
				}
				else {
					res.status(404).json({
						error: 'Task not found.'
					});
				}
			})
			.catch(err => res.status(500).json({
				error: err.message || 'Error occurred while fetching a task.'
			}));
	}
	else {
		models.Task.findAll({
			where: {
				UserId: userId
			},
			attributes: {
				exclude: ['UserId']
			}
		})
			.then(tasks => {
				if (tasks) {
					res.status(200).json({
						data: tasks
					});
				}
				else {
					res.status(404).json({
						error: 'No tasks found.'
					});
				}
			})
			.catch(err => res.status(500).json({
				error: err.message || 'Error occurred while fetching tasks.'
			}));
	}
});

router.patch('/:id', validate, (req, res) => {
	let eventId = req.params.id;
	let userId = req.token.id;
	let values = req.body;
	models.Event.update(values, {
		where: {
			id: eventId,
			UserId: userId
		},
		fields: ['name', 'startDate', 'endDate', 'startTime', 'endTime', 'location', 'details', 'EventTypeId']
	})
		.then(event => {
			if (event) {
				res.status(200).json({
					message: 'Event updated successfully'
				});
			}
			else {
				res.status(404).json({
					error: 'Event not found.'
				});
			}
		})
		.catch(err => res.status(500).json({
			error: err.message || 'Error occurred while updating an event.'
		}));
});

router.delete('/:id', (req, res) => {
	let taskId = req.params.id;
	let userId = req.token.id;
	models.Task.destroy({
		where: {
			id: taskId,
			UserId: userId
		}
	})
		.then(response => {
			if (response) {
				res.status(200).json({
					message: 'Task deleted successfully'
				});
			}
			else {
				res.status(404).json({
					error: 'Task not found.'
				});
			}
		})
		.catch(err => res.status(500).json({
			error: err.message || 'Error occurred while deleting a task.'
		}));
});

module.exports = router;

