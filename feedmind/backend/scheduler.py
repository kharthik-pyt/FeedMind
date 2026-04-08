from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from sqlmodel import Session, select
import logging

logger = logging.getLogger(__name__)

scheduler = BackgroundScheduler()


def start_scheduler(engine):
    """Register the daily feed refresh job and start the scheduler."""

    def job():
        from routers.feed import _refresh_all
        from models import Topic

        logger.info("Scheduler: starting daily feed refresh...")
        with Session(engine) as session:
            topics = session.exec(select(Topic)).all()
            topic_names = [t.name for t in topics]

        _refresh_all(topic_names)
        logger.info("Scheduler: daily refresh complete.")

    # Run every day at 06:00
    scheduler.add_job(job, CronTrigger(hour=6, minute=0), id="daily_refresh", replace_existing=True)
    scheduler.start()
    logger.info("APScheduler started — daily refresh at 06:00.")


def stop_scheduler():
    if scheduler.running:
        scheduler.shutdown()
