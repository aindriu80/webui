import { CdkStepper } from '@angular/cdk/stepper';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { ReactiveFormsModule } from '@angular/forms';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator/jest';
import { mockCall, mockApi } from 'app/core/testing/utils/mock-api.utils';
import { CertificateDigestAlgorithm } from 'app/enums/certificate-digest-algorithm.enum';
import { CertificateKeyType } from 'app/enums/certificate-key-type.enum';
import { IxFormHarness } from 'app/modules/forms/ix-forms/testing/ix-form.harness';
import {
  CsrOptionsComponent,
} from 'app/pages/credentials/certificates-dash/csr-add/steps/csr-options/csr-options.component';

describe('CsrOptionsComponent', () => {
  let spectator: Spectator<CsrOptionsComponent>;
  let loader: HarnessLoader;
  let form: IxFormHarness;

  const createComponent = createComponentFactory({
    component: CsrOptionsComponent,
    imports: [
      ReactiveFormsModule,
    ],
    providers: [
      mockProvider(CdkStepper),
      mockApi([
        mockCall('certificate.ec_curve_choices', {
          BrainpoolP512R1: 'BrainpoolP512R1',
          SECP256K1: 'SECP256K1',
        }),
      ]),
    ],
  });

  beforeEach(async () => {
    spectator = createComponent();
    loader = TestbedHarnessEnvironment.loader(spectator.fixture);
    form = await loader.getHarness(IxFormHarness);
  });

  describe('RSA key type', () => {
    beforeEach(async () => {
      await form.fillForm({
        'Key Type': 'RSA',
        'Key Length': '4096',
        'Digest Algorithm': 'SHA384',
      });
    });

    it('returns fields when getPayload() is called', () => {
      expect(spectator.component.getPayload()).toEqual({
        digest_algorithm: CertificateDigestAlgorithm.Sha384,
        key_length: 4096,
        key_type: CertificateKeyType.Rsa,
      });
    });

    it('returns a summary when getSummary() is called', () => {
      expect(spectator.component.getSummary()).toEqual([
        {
          label: 'Key Type',
          value: 'RSA',
        },
        {
          label: 'Key Length',
          value: '4096',
        },
        {
          label: 'Digest Algorithm',
          value: 'SHA384',
        },
      ]);
    });
  });

  describe('EC key type', () => {
    beforeEach(async () => {
      await form.fillForm(
        {
          'Key Type': 'EC',
          'Digest Algorithm': 'SHA384',
          'EC Curve': 'SECP256K1',
        },
      );
    });

    it('returns fields when getPayload() is called for a key of EC type', () => {
      expect(spectator.component.getPayload()).toEqual({
        ec_curve: 'SECP256K1',
        digest_algorithm: CertificateDigestAlgorithm.Sha384,
        key_type: CertificateKeyType.Ec,
      });
    });

    it('returns a summary when getSummary() is called', () => {
      expect(spectator.component.getSummary()).toEqual([
        {
          label: 'Key Type',
          value: 'EC',
        },
        {
          label: 'EC Curve',
          value: 'SECP256K1',
        },
        {
          label: 'Digest Algorithm',
          value: 'SHA384',
        },
      ]);
    });
  });

  describe('hasLifetime', () => {
    it('shows Lifetime field when hasLifetime is true', async () => {
      spectator.setInput({ hasLifetime: true });

      await form.fillForm({
        Lifetime: '3660',
      });

      expect(spectator.component.getPayload()).toMatchObject({
        lifetime: 3660,
      });

      expect(spectator.component.getSummary()).toContainEqual({
        label: 'Lifetime',
        value: '3660',
      });
    });
  });
});
