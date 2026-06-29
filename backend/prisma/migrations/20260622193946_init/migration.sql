-- CreateEnum
CREATE TYPE "TeamCategory" AS ENUM ('men', 'women', 'pleasure');

-- CreateTable
CREATE TABLE "committees" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "members" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "committees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "key_roles" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "key_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "history_events" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "history_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "team" TEXT NOT NULL,
    "group" TEXT NOT NULL,
    "isDomicile" BOOLEAN NOT NULL,
    "timeStart" TEXT NOT NULL,
    "timeMeetup" TEXT,
    "opponent" TEXT,
    "location" TEXT,
    "boardOfficial" TEXT[],
    "referees" TEXT[],
    "bar" TEXT,
    "result" INTEGER[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "news_articles" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "image" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "news_articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "imageFolder" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variants" (
    "id" SERIAL NOT NULL,
    "size" TEXT,
    "color" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "product_variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flockings" (
    "id" SERIAL NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "maxSize" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,

    CONSTRAINT "flockings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "season_events" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "season_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "category" "TeamCategory" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "teamId" INTEGER NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "week_schedules" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "period" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "week_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "day_schedules" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "weekScheduleId" INTEGER NOT NULL,

    CONSTRAINT "day_schedules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "training_sessions" (
    "id" SERIAL NOT NULL,
    "time" TEXT NOT NULL,
    "groups" TEXT[],
    "location" TEXT NOT NULL,
    "trainer" TEXT NOT NULL,
    "notes" TEXT,
    "dayScheduleId" INTEGER NOT NULL,

    CONSTRAINT "training_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "matches_date_team_key" ON "matches"("date", "team");

-- CreateIndex
CREATE UNIQUE INDEX "flockings_productId_key" ON "flockings"("productId");

-- AddForeignKey
ALTER TABLE "product_variants" ADD CONSTRAINT "product_variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "flockings" ADD CONSTRAINT "flockings_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "day_schedules" ADD CONSTRAINT "day_schedules_weekScheduleId_fkey" FOREIGN KEY ("weekScheduleId") REFERENCES "week_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "training_sessions" ADD CONSTRAINT "training_sessions_dayScheduleId_fkey" FOREIGN KEY ("dayScheduleId") REFERENCES "day_schedules"("id") ON DELETE CASCADE ON UPDATE CASCADE;
