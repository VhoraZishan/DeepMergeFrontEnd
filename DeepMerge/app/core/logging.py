from loguru import logger
import sys


def configure_logging(debug: bool) -> None:
	logger.remove()
	level = "DEBUG" if debug else "INFO"
	logger.add(sys.stdout, level=level, backtrace=False, diagnose=False,
		format="{time:YYYY-MM-DD HH:mm:ss} | {level:<8} | {name}:{function}:{line} - {message}")
