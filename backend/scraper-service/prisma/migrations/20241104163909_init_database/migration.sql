-- CreateTable
CREATE TABLE "scrapes" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "web_name" CHAR NOT NULL,
    "count" INTEGER NOT NULL,
    "url_md5" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "scrapes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_scrapes" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "scrape_id" INTEGER NOT NULL,

    CONSTRAINT "user_scrapes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" SERIAL NOT NULL,
    "mediaUrl" TEXT NOT NULL,
    "hashUrl" CHAR NOT NULL,
    "type" CHAR NOT NULL,
    "scrapeId" INTEGER NOT NULL,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "scrapes_url_md5_key" ON "scrapes"("url_md5");

-- AddForeignKey
ALTER TABLE "user_scrapes" ADD CONSTRAINT "user_scrapes_scrape_id_fkey" FOREIGN KEY ("scrape_id") REFERENCES "scrapes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_scrapeId_fkey" FOREIGN KEY ("scrapeId") REFERENCES "scrapes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
