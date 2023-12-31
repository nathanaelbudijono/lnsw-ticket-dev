import Button from "@/components/core/button";
import LaporanInput from "@/components/form/laporan-input";
import TextArea from "@/components/form/text-area";
import ModalBalik from "@/components/modals/modal-balik-laporan";
import ModalBerhasil from "@/components/modals/modal-berhasil-laporan";
import { getUser } from "@/hooks/get-user-server";
import { useAppStore } from "@/lib/store";
import { GetServerSidePropsContext } from "next";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import ModalSalah from "@/components/modals/modal-tidaklengkap-laporan";
import DropzoneInput from "@/components/form/dropzone-input";
import Typography from "@/components/core/typography";
import Seo from "@/components/core/seo";
import Lines from "@/components/others/lines";
import Head from "@/components/others/header";
import Layout from "@/components/core/layout";
import { User } from "@/lib/slices/user-slices";

type Inputs = {
  name: string;
  email: string;
  judulLaporan: string;
  deskripsiLaporan: string;
  url: string;
  pdf: FileList;
};

export default function Laporan({ user }: { user: User }) {
  const [open, setOpen] = useState<boolean>(false);
  const [opens, setOpens] = useState<boolean>(false);
  const { postForm } = useAppStore();
  const methods = useForm<Inputs>({
    mode: "onTouched",
  });
  const { handleSubmit } = methods;
  // console.log(methods.getValues("photo"));
  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const forms = new FormData();
    forms.append("name", data.name);
    forms.append("email", data.email);
    forms.append("judulLaporan", data.judulLaporan);
    forms.append("deskripsiLaporan", data.deskripsiLaporan);
    forms.append("url", data.url);
    if (data.pdf && data.pdf.length > 0) {
      forms.append("photo", data.pdf[0].name);
    }
    console.log(data.pdf[0].name);
    if (
      !data.email ||
      !data.name ||
      !data.judulLaporan ||
      !data.deskripsiLaporan
    ) {
      setOpen(true);
      return;
    } else {
      await postForm(forms);
      setOpens(true);
    }
  };

  return (
    <>
      <Head />
      <Layout>
        <Seo
          templateTitle="Pengajuan Laporan"
          description="Isi form untuk mengajukan layanan kepada LNSW."
        />
        <Typography variant="largebold">Formulir Laporan</Typography>
        <section className="bg-white rounded-md shadow-md">
          <form onSubmit={handleSubmit(onSubmit)} className="form">
            <FormProvider {...methods}>
              <LaporanInput
                id="name"
                label="Nama"
                placeholder="Masukkan nama anda"
                defaultValue={user?.username}
                readOnly
                required
              />
              <LaporanInput
                id="email"
                label="Email"
                placeholder="Masukkan email anda"
                type="email"
                defaultValue={user?.username + "@gmail.com"}
                readOnly
                required
              />
              <LaporanInput
                id="judulLaporan"
                label="Judul Laporan"
                placeholder="Tuliskan inti dari laporan anda"
                required
              />
              <TextArea
                id="deskripsiLaporan"
                label="Deskripsi Laporan"
                placeholder="Tuliskan laporan anda"
                required
              />
              <LaporanInput
                id="url"
                label="URL"
                placeholder="Masukkan file URL"
              />
              <Lines />
              <DropzoneInput
                id="pdf"
                label="Unggah bukti laporan"
                accept={{ "application/pdf": [".pdf"] }}
              />
              <div className="flex justify-between max-sm:flex-col-reverse max-sm:gap-3">
                <ModalBalik>
                  {({ openModal }) => (
                    <Button
                      onClick={openModal}
                      variant="default"
                      size="submit"
                      type="button"
                      className="max-sm:w-full"
                    >
                      Balik
                    </Button>
                  )}
                </ModalBalik>
                <Button
                  variant="default"
                  size="submit"
                  type="submit"
                  className="max-sm:w-full"
                >
                  Submit Laporan
                </Button>
              </div>
            </FormProvider>
          </form>
        </section>
        {opens && <ModalBerhasil />}
        {open && <ModalSalah />}
      </Layout>
    </>
  );
}

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  return await getUser(ctx);
}
