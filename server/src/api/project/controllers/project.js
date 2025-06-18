'use strict';

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::project.project', ({ strapi }) => ({
  async delete(ctx) {
    const { id } = ctx.params;

    try {
      // 1. Verwijder eerst ALLE taken gekoppeld aan dit project
      const tasks = await strapi.entityService.findMany('api::task.task', {
        filters: {
          project: id,
        },
      });

      for (const task of tasks) {
        await strapi.entityService.delete('api::task.task', task.id);
      }

      // 2. Verwijder dan het project zelf
      const deletedProject = await strapi.entityService.delete('api::project.project', id);

      return deletedProject;
    } catch (err) {
      ctx.throw(500, 'Fout bij verwijderen project en taken');
    }
  },
}));
